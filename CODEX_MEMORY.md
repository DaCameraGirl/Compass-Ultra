# Codex Project Memory

Persistent note for future Codex sessions working in this repo.

## Daily GitHub Update Habit

At the end of each work session, update GitHub with what changed that day.

Checklist:

- Run `git status --short` and review the final file list.
- Update `CHANGELOG.md` with a dated entry when user-visible behavior, deployment setup, auth, billing, docs, or repo workflow changes.
- For small maintenance-only changes, add a short note here instead of overloading the changelog.
- Run the relevant verification commands before committing. For frontend/app changes, prefer `npm run build`, `npm run lint`, and `npm test`.
- Commit with a clear message describing the actual work.
- Push `main` to `origin` so Vercel can deploy frontend changes.
- Tell the user the latest commit hash and whether the working tree is clean.

## Current Auth Setup Notes

- Frontend is deployed on Vercel.
- Backend and Postgres are on Railway.
- Auth0 social login connections are `google-oauth2` and `github`.
- Vercel env vars used by the frontend:
  - `VITE_AUTH0_GOOGLE_CONNECTION=google-oauth2`
  - `VITE_AUTH0_GITHUB_CONNECTION=github`
- The visible app UI should use Gmail/Google and GitHub login, not the email/password Auth0 fallback.
