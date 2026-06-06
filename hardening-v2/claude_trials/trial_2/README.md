# Git Force-Push Recovery

## Objective
Restore exact Git refs after an accidental force push. The workflow must run without network access after unpacking.

## Primary inputs
| Path | Role |
|---|---|
| `repo_after_force.bundle` | Surviving remote state after the force push |
| `orphaned_object_store/.git/objects` | Dangling loose objects recovered from another local clone |
| `reflog_export.txt` | Reflog-style evidence; preserve each leading SHA once in first-seen order |
| `recovery_plan.json` | Human-facing recovery rules that identify branch tips and checksum targets from reflog subjects |
| `output_schemas/` | JSON contracts for required reports |

## Required recovery cases
| Path | Required behavior |
|---|---|
| `recovery_cases/partial_overlap/` | Recover successfully by combining the bundle with loose objects; neither source is sufficient by itself |
| `recovery_cases/corrupted_bundle/` | Reject the corrupt bundle with `error=after_bundle_invalid`; do not emit a successful repaired bundle |

Each recovery case has its own `repo_after_force.bundle`, `orphaned_object_store/.git/objects`,
`reflog_export.txt`, and `recovery_plan.json`. Derive the exact refs, graph, and Git blob IDs
from those inputs. Do not assume the primary case answers apply unless the case evidence proves it.

## Deliverables
- `outputs/recovery_tool.py`
- `outputs/repaired_repo.bundle`
- `outputs/repair_log.json`
- `outputs/commit_graph_report.json`
- `outputs/recovery_case_report.json`
- `outputs/run_manifest.json`

## Provenance
All repository content and fixtures are synthetic and generated locally for this offline recovery scenario.

## SHA-256 checksums
| Path | SHA-256 |
|---|---|
| `orphaned_object_store/.git/objects` | 7ff4609610d63f7fe2ac99713dbe85aba3977deba2be3a1a08cf1b52e772b862 |
| `repo_after_force.bundle` | 42ed2b29143ac9ae215528dcb94855da46db9a498bb6ba3fbba91938d8a9debc |
| `reflog_export.txt` | 5258ff7229fd8051a375df53e1dc106e3fb1a9378ce180ed7dac0ae7fbec7eb1 |
| `recovery_plan.json` | worker-facing branch and checksum recovery rules |
| `output_schemas` | 0ea0cb7cf028956ce0b36d38bac429bfac0acf25212960434a414d314eb455b2 |
| `recovery_cases` | 6767fdbef7c10cc868134b7420039e609edb9fbdfb032b1d2d663b7ca7c4df75 |
| `version_manifest.json` | 1d1fa45640ce7f9cfadf65917e8dbac9f3aa5c3b45f88ff988ff80848285a132 |
