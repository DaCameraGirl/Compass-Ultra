# Claude Trial Prompt

Paste this into Claude Code while Claude Code is opened in one trial folder, for
example:

`C:\Users\enter\OneDrive\Desktop\Compass-Ultra-Pro\hardening-v2\claude_trials\trial_1`

Do not mention the hidden verifier or golden files.

```text
You are working offline in this folder. Complete the Git force-push recovery task using only the files already present in the current directory.

## Objective

Restore the published Git refs after an accidental force push changed branch history. Preserve the exact original commit SHAs; do not recreate equivalent commits with cherry-pick.

## Provided files

- `repo_after_force.bundle`, `orphaned_object_store/.git/objects`, `reflog_export.txt`, and `recovery_plan.json` describe the primary recovery evidence.
- `recovery_plan.json` identifies branch tips and checksum targets by reflog subject. Derive the exact refs, graph, and Git blob IDs from the Git evidence; direct answer fixtures are not provided in the worker resources.
- `recovery_cases/partial_overlap/` contains a second valid recovery where the after-bundle and loose object store each provide only part of the required graph.
- `recovery_cases/corrupted_bundle/` contains an invalid bundle that your tool must reject as `after_bundle_invalid` without emitting a misleading successful repair.
- `output_schemas/` defines the JSON output contracts. `README.md` explains the case layouts.

## Deliverables

Create `outputs/recovery_tool.py`, `outputs/repaired_repo.bundle`, `outputs/repair_log.json`, `outputs/commit_graph_report.json`, `outputs/recovery_case_report.json`, and `outputs/run_manifest.json`.

## Success criteria

- The repaired primary bundle must clone successfully and pass `git fsck --connectivity-only` with no missing or corrupt objects.
- Restore every required branch ref to the exact original SHA derived from the evidence, report the recovered graph, and report every requested checksum target with `status="match"`.
- `repair_log.orphaned_shas` must include each leading SHA from `reflog_export.txt` exactly once, in first-seen reflog order, using 7-character short SHA form.
- `outputs/recovery_tool.py` must restore the partial-overlap case and reject the corrupted-bundle case with `error="after_bundle_invalid"`. Record both outcomes in `outputs/recovery_case_report.json`.

## Constraints

Run entirely offline. All JSON outputs must match the schemas in `output_schemas/`, preserve declared ordering, and be deterministic across clean reruns.

Implement the task end to end. Run your own checks before finishing.
```

