#!/usr/bin/env python3
"""Offline Git force-push recovery tool.

Reconstructs the pre-force-push branch refs from the surviving evidence that
ships with a recovery case:

  * ``repo_after_force.bundle``         surviving remote state after the push
  * ``orphaned_object_store/.git/objects``  dangling loose objects from a clone
  * ``reflog_export.txt``               reflog-style evidence (leading short SHAs)
  * ``recovery_plan.json``              maps reflog subjects -> branch tips /
                                        checksum targets

The tool never touches the network. It shells out to ``git`` (which is the only
reliable way to read packfiles/loose objects and rebuild a bundle) but performs
no fetch/clone over any remote.

CLI
---
Recover a single case (used by the verifier to drive the partial-overlap and
corrupted-bundle cases)::

    python recovery_tool.py --case-dir <dir> --out-bundle <path> [--repair-log <p>]
                            [--commit-graph <p>]

Exit codes:
    0   recovery succeeded and a repaired bundle was written
    2   the after-bundle was invalid -> rejected with ``after_bundle_invalid``;
        no repaired bundle is written
    1   any other failure

Regenerate every deliverable for the primary trial folder deterministically::

    python recovery_tool.py --emit-all --root <trial_dir> --out-dir <out_dir>
"""

from __future__ import annotations

import argparse
import json
import platform
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SOLVER_NAME = "recovery_tool.py"

EXIT_OK = 0
EXIT_ERROR = 1
EXIT_BUNDLE_INVALID = 2

ERROR_BUNDLE_INVALID = "after_bundle_invalid"


class BundleInvalid(Exception):
    """Raised when the surviving after-bundle is not a readable git bundle."""


class RecoveryError(Exception):
    """Raised for any non-bundle recovery failure."""


# --------------------------------------------------------------------------- #
# git helpers
# --------------------------------------------------------------------------- #
def _git(args, cwd=None, check=True):
    """Run a git command and return CompletedProcess (text mode)."""
    proc = subprocess.run(
        ["git", *args],
        cwd=str(cwd) if cwd else None,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if check and proc.returncode != 0:
        raise RecoveryError(
            "git %s failed (%d): %s"
            % (" ".join(args), proc.returncode, proc.stderr.strip())
        )
    return proc


def _git_out(args, cwd=None):
    return _git(args, cwd=cwd).stdout.strip()


# --------------------------------------------------------------------------- #
# evidence parsing
# --------------------------------------------------------------------------- #
def parse_reflog(reflog_path: Path):
    """Return [(short_sha, subject), ...] in file order.

    A reflog line looks like::

        1b1be16 HEAD@{0}: commit: Merge feature/urgent-fix into release-v2.1

    ``subject`` is everything after the first ``: `` that follows the
    ``HEAD@{n}`` selector, i.e. the human-readable message used by the
    recovery plan to match targets.
    """
    entries = []
    for raw in reflog_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        parts = line.split(None, 1)
        short = parts[0]
        rest = parts[1] if len(parts) > 1 else ""
        # subject = text after the "...: " selector prefix; fall back to rest
        if ": " in rest:
            subject = rest.split(": ", 1)[1]
        else:
            subject = rest
        entries.append((short, subject))
    return entries


def orphaned_shas(reflog_entries):
    """Leading short SHAs in first-seen order, deduplicated (7-char form)."""
    seen = set()
    ordered = []
    for short, _subject in reflog_entries:
        key = short[:7]
        if key not in seen:
            seen.add(key)
            ordered.append(key)
    return ordered


def short_for_subject(reflog_entries, needle):
    """Return the leading short SHA whose reflog subject contains ``needle``."""
    for short, subject in reflog_entries:
        if needle in subject:
            return short
    raise RecoveryError("no reflog entry matches subject %r" % needle)


# --------------------------------------------------------------------------- #
# bundle validity
# --------------------------------------------------------------------------- #
def bundle_is_valid(bundle_path: Path) -> bool:
    """True when ``git`` recognises the file as a v2/v3 bundle.

    ``git bundle list-heads`` only reads the bundle header, so it cleanly
    distinguishes a real (possibly prerequisite-bearing) bundle from a
    corrupted/truncated file without needing the objects to be present.
    """
    if not bundle_path.is_file():
        return False
    proc = _git(["bundle", "list-heads", str(bundle_path)], check=False)
    return proc.returncode == 0


def bundle_heads(bundle_path: Path):
    """Return ``{refname: full_sha}`` exactly as stored in the bundle header."""
    heads = {}
    proc = _git(["bundle", "list-heads", str(bundle_path)], check=False)
    if proc.returncode != 0:
        return heads
    for line in proc.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        sha, _sep, ref = line.partition(" ")
        if ref:
            heads[ref] = sha
    return heads


# --------------------------------------------------------------------------- #
# repo assembly
# --------------------------------------------------------------------------- #
def _copy_loose_objects(src_objects: Path, dst_repo: Path):
    """Merge a loose ``objects`` directory into ``dst_repo``'s object store."""
    if not src_objects.is_dir():
        return
    dst_objects = dst_repo / ".git" / "objects"
    shutil.copytree(src_objects, dst_objects, dirs_exist_ok=True)


def build_combined_repo(case_dir: Path, work_repo: Path):
    """Init ``work_repo`` and fill it with bundle objects + loose objects.

    Returns the path to the initialised repo. Raises ``BundleInvalid`` if the
    after-bundle cannot be read.
    """
    bundle = case_dir / "repo_after_force.bundle"
    if not bundle_is_valid(bundle):
        raise BundleInvalid(str(bundle))

    _git(["init", "-q", str(work_repo)])
    # Loose objects first so unbundle can reuse anything already present.
    _copy_loose_objects(
        case_dir / "orphaned_object_store" / ".git" / "objects", work_repo
    )
    # Import every object carried by the surviving bundle.
    unb = _git(["bundle", "unbundle", str(bundle.resolve())], cwd=work_repo, check=False)
    if unb.returncode != 0:
        # A header-valid bundle that still fails to unbundle is unusable.
        raise BundleInvalid(str(bundle))
    return work_repo


# --------------------------------------------------------------------------- #
# core recovery
# --------------------------------------------------------------------------- #
def recover_case(case_dir: Path, out_bundle: Path):
    """Recover one case end to end.

    Returns a result dict with the resolved refs, the recovered commit graph,
    checksum verification, and orphaned SHAs. Raises ``BundleInvalid`` for a
    corrupt after-bundle (caller maps this to ``after_bundle_invalid``).
    """
    case_dir = case_dir.resolve()
    plan = json.loads((case_dir / "recovery_plan.json").read_text(encoding="utf-8"))
    reflog_entries = parse_reflog(case_dir / "reflog_export.txt")

    with tempfile.TemporaryDirectory(prefix="gitrec_") as tmp:
        tmp = Path(tmp)
        work = build_combined_repo(case_dir, tmp / "work")

        # ---- resolve branch tips from reflog subjects -------------------- #
        refs_expected = {}
        for target in plan.get("branch_targets", []):
            ref = target["ref"]
            short = short_for_subject(
                reflog_entries, target["reflog_subject_contains"]
            )
            full = _git_out(["rev-parse", "--verify", "%s^{commit}" % short], cwd=work)
            refs_expected[ref] = full

        # ---- write the refs and build the repaired bundle ---------------- #
        for ref, full in refs_expected.items():
            _git(["update-ref", ref, full], cwd=work)

        # Point HEAD at a restored branch (prefer main) so a clone of the
        # bundle can auto-checkout a default branch cleanly. HEAD is recorded
        # in the bundle header but is not one of the required branch refs.
        head_ref = "refs/heads/main" if "refs/heads/main" in refs_expected else (
            next(iter(refs_expected), None)
        )
        if head_ref:
            _git(["symbolic-ref", "HEAD", head_ref], cwd=work)

        out_bundle = out_bundle.resolve()
        out_bundle.parent.mkdir(parents=True, exist_ok=True)
        if out_bundle.exists():
            out_bundle.unlink()
        bundle_refs = (["HEAD"] if head_ref else []) + list(refs_expected.keys())
        _git(["bundle", "create", str(out_bundle), *bundle_refs], cwd=work)

        # ---- refs actually stored in the repaired bundle ----------------- #
        # (Cloning a bundle only materialises the HEAD branch as refs/heads/*;
        # the bundle header is the authoritative record of every restored ref.)
        refs_restored = {
            ref: sha
            for ref, sha in bundle_heads(out_bundle).items()
            if ref in refs_expected
        }
        all_refs_restored = refs_restored == refs_expected

        # ---- verify the bundle clones and passes connectivity fsck ------- #
        clone = tmp / "verify_clone"
        cl = _git(["clone", "-q", str(out_bundle), str(clone)], check=False)
        bundle_cloneable = cl.returncode == 0
        fsck_ok = False
        if bundle_cloneable:
            # Materialise every ref so fsck checks connectivity for all of them.
            for ref, full in refs_expected.items():
                _git(["update-ref", ref, full], cwd=clone, check=False)
            fsck = _git(
                ["fsck", "--connectivity-only", "--no-progress"],
                cwd=clone,
                check=False,
            )
            fsck_ok = fsck.returncode == 0 and not fsck.stdout.strip() and (
                "missing" not in fsck.stderr.lower()
                and "corrupt" not in fsck.stderr.lower()
            )

        # ---- commit graph report ----------------------------------------- #
        branches = {}
        for ref, full in refs_expected.items():
            tip_short = full[:7]
            revs = _git_out(["rev-list", full], cwd=work).split()
            ancestors_full = revs[1:]  # drop the tip itself
            expected_anc = [c[:7] for c in ancestors_full]
            found_anc = []
            for c in ancestors_full:
                present = _git(
                    ["cat-file", "-e", "%s^{commit}" % c], cwd=work, check=False
                ).returncode == 0
                if present:
                    found_anc.append(c[:7])
            branches[ref] = {
                "tip": tip_short,
                "expected_ancestors": expected_anc,
                "found_ancestors": found_anc,
                "all_reachable": found_anc == expected_anc,
            }

        # ---- checksum targets (blob ids) --------------------------------- #
        verify_repo = clone if bundle_cloneable else work
        checksums = {}
        for target in plan.get("checksum_targets", []):
            short = short_for_subject(
                reflog_entries, target["reflog_subject_contains"]
            )
            path = target["path"]
            commit_full = _git_out(
                ["rev-parse", "--verify", "%s^{commit}" % short], cwd=work
            )
            # expected: blob id from the assembled evidence repo
            expected_blob = _git_out(
                ["rev-parse", "--verify", "%s:%s" % (commit_full, path)], cwd=work
            )
            # actual: blob id as it exists in the repaired/cloned bundle
            actual_proc = _git(
                ["rev-parse", "--verify", "%s:%s" % (commit_full, path)],
                cwd=verify_repo,
                check=False,
            )
            actual_blob = actual_proc.stdout.strip() if actual_proc.returncode == 0 else None
            if actual_blob is None:
                status = "file_not_found"
            elif actual_blob == expected_blob:
                status = "match"
            else:
                status = "mismatch"
            checksums.setdefault(short[:7], {})[path] = {
                "status": status,
                "expected": expected_blob,
                "actual": actual_blob,
            }

    return {
        "branches_restored": list(refs_expected.keys()),
        "refs_expected": refs_expected,
        "refs_restored": refs_restored,
        "all_refs_restored": all_refs_restored,
        "orphaned_shas": orphaned_shas(reflog_entries),
        "bundle_created": out_bundle.is_file(),
        "checksums": checksums,
        # extra fields used by the case report / driver, not part of repair_log
        "_branches_graph": branches,
        "_bundle_cloneable": bundle_cloneable,
        "_fsck_connectivity": fsck_ok,
    }


def repair_log_view(result):
    """Project a recover_case result onto the repair_log.schema.json shape."""
    return {
        "branches_restored": result["branches_restored"],
        "refs_expected": result["refs_expected"],
        "refs_restored": result["refs_restored"],
        "all_refs_restored": result["all_refs_restored"],
        "orphaned_shas": result["orphaned_shas"],
        "bundle_created": result["bundle_created"],
        "checksums": result["checksums"],
    }


def commit_graph_view(result):
    return {"branches": result["_branches_graph"]}


def _dump_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


# --------------------------------------------------------------------------- #
# CLI: single case
# --------------------------------------------------------------------------- #
def run_single_case(args) -> int:
    case_dir = Path(args.case_dir)
    out_bundle = Path(args.out_bundle)
    try:
        result = recover_case(case_dir, out_bundle)
    except BundleInvalid:
        # Make sure no misleading bundle is left behind.
        if out_bundle.exists():
            out_bundle.unlink()
        payload = {"error": ERROR_BUNDLE_INVALID, "rejected": True,
                   "repaired_bundle_created": False}
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
        return EXIT_BUNDLE_INVALID
    except RecoveryError as exc:
        json.dump({"error": "recovery_failed", "detail": str(exc)}, sys.stdout, indent=2)
        sys.stdout.write("\n")
        return EXIT_ERROR

    if args.repair_log:
        _dump_json(Path(args.repair_log), repair_log_view(result))
    if args.commit_graph:
        _dump_json(Path(args.commit_graph), commit_graph_view(result))

    ok = (
        result["bundle_created"]
        and result["all_refs_restored"]
        and result["_bundle_cloneable"]
        and result["_fsck_connectivity"]
    )
    summary = {
        "status": "ok" if ok else "incomplete",
        "bundle_created": result["bundle_created"],
        "bundle_cloneable": result["_bundle_cloneable"],
        "fsck_connectivity": result["_fsck_connectivity"],
        "all_refs_restored": result["all_refs_restored"],
        "refs_restored": result["refs_restored"],
    }
    json.dump(summary, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return EXIT_OK if ok else EXIT_ERROR


# --------------------------------------------------------------------------- #
# CLI: emit every deliverable for the primary trial folder
# --------------------------------------------------------------------------- #
def _run_case_subprocess(case_dir: Path, out_bundle: Path):
    """Invoke this tool as a child process so exit codes are authentic."""
    proc = subprocess.run(
        [sys.executable, str(Path(__file__).resolve()),
         "--case-dir", str(case_dir), "--out-bundle", str(out_bundle)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
    )
    out = {}
    try:
        out = json.loads(proc.stdout) if proc.stdout.strip() else {}
    except json.JSONDecodeError:
        out = {}
    return proc.returncode, out


def build_case_report(root: Path, tmp_dir: Path):
    """Drive the partial-overlap and corrupted-bundle cases via the CLI."""
    cases = root / "recovery_cases"

    # partial overlap: must recover successfully
    po_bundle = tmp_dir / "partial_overlap.bundle"
    po_code, po_out = _run_case_subprocess(cases / "partial_overlap", po_bundle)
    po_cloneable = bool(po_out.get("bundle_cloneable", False))
    po_fsck = bool(po_out.get("fsck_connectivity", False))
    po_pass = po_code == EXIT_OK and po_cloneable and po_fsck

    # corrupted bundle: must be rejected, no bundle emitted
    cb_bundle = tmp_dir / "corrupted_bundle.bundle"
    cb_code, cb_out = _run_case_subprocess(cases / "corrupted_bundle", cb_bundle)
    cb_rejected = cb_code == EXIT_BUNDLE_INVALID and cb_out.get("error") == ERROR_BUNDLE_INVALID
    cb_bundle_created = cb_bundle.is_file()
    cb_pass = cb_rejected and not cb_bundle_created

    return {
        "partial_overlap": {
            "status": "PASS" if po_pass else "FAIL",
            "tool_exit_code": po_code,
            "bundle_cloneable": po_cloneable,
            "fsck_connectivity": po_fsck,
        },
        "corrupted_bundle": {
            "status": "PASS" if cb_pass else "FAIL",
            "tool_exit_code": cb_code,
            "rejected": cb_rejected,
            "repaired_bundle_created": cb_bundle_created,
            "error": ERROR_BUNDLE_INVALID,
        },
    }


def run_emit_all(args) -> int:
    root = Path(args.root).resolve()
    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    # 1) primary recovery -> repaired bundle + repair log + commit graph
    primary = recover_case(root, out_dir / "repaired_repo.bundle")
    _dump_json(out_dir / "repair_log.json", repair_log_view(primary))
    _dump_json(out_dir / "commit_graph_report.json", commit_graph_view(primary))

    # 2) recovery case report (drives the two sub-cases via the CLI)
    with tempfile.TemporaryDirectory(prefix="gitrec_cases_") as tmp:
        case_report = build_case_report(root, Path(tmp))
    _dump_json(out_dir / "recovery_case_report.json", case_report)

    # 3) run manifest
    manifest = {
        "solver": SOLVER_NAME,
        "python": "Python " + platform.python_version(),
        "branches_restored": len(primary["branches_restored"]),
        "bundle_created": primary["bundle_created"],
    }
    _dump_json(out_dir / "run_manifest.json", manifest)

    ok = (
        primary["bundle_created"]
        and primary["all_refs_restored"]
        and primary["_bundle_cloneable"]
        and primary["_fsck_connectivity"]
        and case_report["partial_overlap"]["status"] == "PASS"
        and case_report["corrupted_bundle"]["status"] == "PASS"
    )
    print("emit-all: %s" % ("ok" if ok else "INCOMPLETE"))
    return EXIT_OK if ok else EXIT_ERROR


# --------------------------------------------------------------------------- #
# entrypoint
# --------------------------------------------------------------------------- #
def build_parser():
    p = argparse.ArgumentParser(description="Offline git force-push recovery tool")
    p.add_argument("--case-dir", help="recover a single case directory")
    p.add_argument("--out-bundle", help="path to write the repaired bundle")
    p.add_argument("--repair-log", help="optional repair_log.json output path")
    p.add_argument("--commit-graph", help="optional commit_graph_report.json output path")
    p.add_argument("--emit-all", action="store_true",
                   help="regenerate every deliverable for the primary trial folder")
    p.add_argument("--root", help="primary trial folder (with --emit-all)")
    p.add_argument("--out-dir", help="output directory (with --emit-all)")
    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    if args.emit_all:
        if not args.root or not args.out_dir:
            print("--emit-all requires --root and --out-dir", file=sys.stderr)
            return EXIT_ERROR
        return run_emit_all(args)
    if not args.case_dir or not args.out_bundle:
        print("--case-dir and --out-bundle are required", file=sys.stderr)
        return EXIT_ERROR
    return run_single_case(args)


if __name__ == "__main__":
    raise SystemExit(main())
