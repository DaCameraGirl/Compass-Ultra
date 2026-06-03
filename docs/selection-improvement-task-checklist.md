# Selection Improvement Task Checklist

Use this when preparing or revising Terminal Bench, Outlier, or Selection Improvement Experts tasks.

## Core Rule

Keep worker resources separate from golden verifier resources.

Worker resources can include evidence, schemas, plans, fixtures, and case folders. They must not include direct answer fixtures.

Golden solution resources can include solve scripts, verifier scripts, hidden expected outputs, and hidden verifier inputs.

## Before Uploading A Task

1. Confirm the resources zip is worker facing only.
2. Confirm the golden zip contains the verifier inputs and reference solution files.
3. Run the reference solution locally.
4. Run the verifier locally against the reference solution.
5. Run at least one frontier model trial if time allows.
6. Trust the hidden verifier result over any model self report.

## Red Flag Terms In Worker Facing Text

If these file names appear in the prompt, resources list, golden solution steps for workers, or uploaded resource zip contents, stop and fix the task:

`expected_refs.json`

`commit_graph_spec.json`

`expected_file_checksums.json`

Those names are allowed only in golden-side verifier code, hidden verifier inputs, internal notes, or archived scratch work. They should not appear as files included in the worker resources.

## Git Recovery Task Pattern

For the Git force push recovery task, the worker resources should say:

`recovery_plan.json` identifies branch tips and checksum targets by reflog subject.

The worker must derive exact refs, graph topology, and Git blob IDs from Git evidence.

Direct answer fixtures are not provided in the worker resources.

The hidden verifier compares the submitted output against golden-side verifier inputs.

## Command Names

Do not rewrite real command names to avoid hyphens. Some hyphens are required.

Correct:

`git fsck --connectivity-only`

Wrong:

`git fsck, connectivity only`

## Form Review Habit

Before clicking Next or Save, scan the visible form for:

1. Old direct answer fixture names in worker facing sections.
2. Old non-v2 zip names.
3. Generic category values such as `Soft`.
4. Claims that the worker can read hidden verifier inputs.
5. Model generated helper text that drifted away from the final task design.

For the v2 Git task, the correct category is:

`Software Engineering, Version Control`

The correct zip files are:

`selection_improvement_experts_RESOURCES_task_kit_v2.zip`

`selection_improvement_experts_GOLDEN_SOLUTION_FILES_golden_kit_v2.zip`

