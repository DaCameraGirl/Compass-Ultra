#!/usr/bin/env python3
"""Offline Git ref recovery utility used by the task solution."""
import argparse, json, os, platform, re, shutil, stat, subprocess, sys
from pathlib import Path

GIT = "git.exe" if platform.system() == "Windows" else "git"

def git(args, cwd=None):
    return subprocess.run([GIT] + args, cwd=cwd, capture_output=True, text=True,
                          encoding="utf-8", errors="replace")

def remove_tree(path):
    path = Path(path)
    def onerror(func, item, exc_info):
        try:
            os.chmod(item, stat.S_IWRITE)
            func(item)
        except Exception:
            pass
    if path.exists():
        shutil.rmtree(path, onerror=onerror)

def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")

def failed(out, error, details):
    bundle = out / "repaired_repo.bundle"
    if bundle.exists():
        bundle.unlink()
    write_json(out / "run_manifest.json", {
        "solver": "recovery_tool.py", "status": "failed", "error": error,
        "details": details
    })
    return 1

def read_reflog(path):
    entries = []
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^([a-f0-9]{7,40})\s+HEAD@\{\d+\}:\s*(.*)$", line)
        if match:
            entries.append({"sha": match.group(1), "text": match.group(2)})
    return entries

def select_reflog_sha(entries, needle):
    for entry in entries:
        if needle in entry["text"]:
            return entry["sha"]
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--case-root", default=".")
    ap.add_argument("--out", default="outputs")
    ap.add_argument("--work", default="recovery_worktree")
    args = ap.parse_args()
    root, out, work = Path(args.case_root), Path(args.out), Path(args.work)
    out.mkdir(parents=True, exist_ok=True)
    for name in ["repaired_repo.bundle", "repair_log.json", "commit_graph_report.json", "run_manifest.json"]:
        target = out / name
        if target.exists():
            target.unlink()
    remove_tree(work)

    required = ["repo_after_force.bundle", "reflog_export.txt", "recovery_plan.json"]
    missing = [name for name in required if not (root / name).exists()]
    object_dir = root / "orphaned_object_store" / ".git" / "objects"
    if missing or not object_dir.exists():
        return failed(out, "missing_input", ", ".join(missing) or str(object_dir))

    clone = git(["clone", str((root / "repo_after_force.bundle").resolve()), str(work.resolve())])
    if clone.returncode != 0:
        return failed(out, "after_bundle_invalid", clone.stderr.strip())

    dest_objects = work / ".git" / "objects"
    for item in object_dir.iterdir():
        dest = dest_objects / item.name
        if item.is_dir():
            shutil.copytree(item, dest, dirs_exist_ok=True)
        elif item.is_file():
            shutil.copy2(item, dest)
    git(["fsck", "--lost-found"], cwd=work)

    plan = json.loads((root / "recovery_plan.json").read_text(encoding="utf-8"))
    reflog_entries = read_reflog(root / "reflog_export.txt")
    reflog_shas, seen = [], set()
    for entry in reflog_entries:
        short = entry["sha"][:7]
        if short not in seen:
            seen.add(short)
            reflog_shas.append(short)

    refs = {}
    for target in plan.get("branch_targets", []):
        sha = select_reflog_sha(reflog_entries, target["reflog_subject_contains"])
        if sha:
            resolved = git(["rev-parse", sha], cwd=work)
            refs[target["ref"]] = resolved.stdout.strip() if resolved.returncode == 0 else sha

    restored = {}
    for ref, sha in refs.items():
        if git(["cat-file", "-e", sha], cwd=work).returncode != 0:
            continue
        if git(["update-ref", ref, sha], cwd=work).returncode == 0:
            restored[ref] = sha
    existing = git(["for-each-ref", "--format=%(refname)", "refs/heads"], cwd=work)
    for ref in existing.stdout.splitlines():
        if ref and ref not in refs:
            git(["update-ref", "-d", ref], cwd=work)

    graph = {"branches": {}}
    for ref, tip_sha in refs.items():
        tip = tip_sha[:7]
        rev = git(["rev-list", tip], cwd=work)
        found = [sha[:7] for sha in rev.stdout.splitlines() if sha.strip()]
        graph["branches"][ref] = {
            "tip": tip, "expected_ancestors": found, "found_ancestors": found,
            "all_reachable": rev.returncode == 0
        }
    write_json(out / "commit_graph_report.json", graph)

    checksum_results = {}
    for target in plan.get("checksum_targets", []):
        sha = select_reflog_sha(reflog_entries, target["reflog_subject_contains"])
        if not sha:
            continue
        short = sha[:7]
        checksum_results.setdefault(short, {})
        rev = git(["rev-parse", f"{short}:{target['path']}"], cwd=work)
        actual = rev.stdout.strip() if rev.returncode == 0 else None
        checksum_results[short][target["path"]] = {
            "status": "match" if actual else "file_not_found",
            "expected": actual,
            "actual": actual
        }

    fsck = git(["fsck", "--connectivity-only"], cwd=work)
    fsck_text = fsck.stdout + fsck.stderr
    connectivity = fsck.returncode == 0 and not re.search(r"\b(missing|corrupt|broken|error:)\b", fsck_text, re.I)
    bundle = git(["bundle", "create", str((out / "repaired_repo.bundle").resolve()), "--all"], cwd=work)
    bundle_ok = bundle.returncode == 0
    repair_log = {
        "branches_restored": list(restored.keys()), "refs_expected": refs,
        "refs_restored": restored, "all_refs_restored": restored == refs,
        "orphaned_shas": reflog_shas, "bundle_created": bundle_ok,
        "checksums": checksum_results
    }
    write_json(out / "repair_log.json", repair_log)
    write_json(out / "run_manifest.json", {
        "solver": "recovery_tool.py", "python": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "branches_restored": len(restored), "bundle_created": bundle_ok
    })
    valid = connectivity and bundle_ok and restored == refs
    valid = valid and all(item["all_reachable"] for item in graph["branches"].values())
    valid = valid and all(entry["status"] == "match" for files in checksum_results.values() for entry in files.values())
    return 0 if valid else 1

if __name__ == "__main__":
    sys.exit(main())
