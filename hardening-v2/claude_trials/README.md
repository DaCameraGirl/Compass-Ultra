# Claude Difficulty Trial Setup

Run three independent Claude Code trials:

1. Open Claude Code in `trial_1`.
2. Paste the prompt from `CLAUDE_TRIAL_PROMPT.md`.
3. Let Claude create the required `outputs/`.
4. From PowerShell in `C:\Users\enter\OneDrive\Desktop\Compass-Ultra-Pro`, run:

```powershell
.\hardening-v2\claude_trials\VERIFY_TRIAL.ps1 trial_1
```

Repeat with `trial_2` and `trial_3`.

Interpretation:

- `VERIFY PASS: All checks ok` means Claude passed that trial.
- `FAIL [...]` means Claude failed that trial.
- For difficulty, you want Claude to fail at least 2 of 3 trials.

Do not copy `verify.py`, `verifier_inputs`, or the golden zip into a trial
folder before Claude finishes that trial.

