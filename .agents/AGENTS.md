# Automated Deployment Workflow

These rules govern how the agent should finalize every completed task or feature within this workspace.

## Build Verification
Before committing or pushing any code, you MUST always perform the following checks:
1. Run `npm install` if new dependencies were added.
2. Run `npm run lint` (if the script exists).
3. Run `npm run type-check` or `tsc -b` (if the script exists).
4. Run `npm run build`.
5. If any of the above commands fail with build, TypeScript, lint, or dependency errors, you MUST diagnose and automatically fix them before proceeding.
6. Only proceed to Git operations if the build completes successfully with 0 errors.

## Git Operations
After a successful build and feature completion:
1. Run `git add .` to stage all modified files.
2. Commit the changes using the Conventional Commits format (e.g., `feat: [message]`, `fix: [message]`, `refactor: [message]`, `docs: [message]`).
3. Run `git push` to push to the configured remote repository.
4. If the push fails because the local branch is behind, safely pull/rebase, resolve conflicts if possible, run the build again, and retry the push.
5. NEVER overwrite or force-push history (`git push -f`) unless explicitly instructed by the user.

## Vercel Deployment
After a successful `git push`:
1. Run `vercel --prod` to trigger a production deployment.
2. Wait for the deployment task to finish (e.g., using the `schedule` tool).
3. Verify the deployment status in the output logs.
4. If the deployment fails on Vercel, diagnose the issue from the logs, apply the required fixes locally, commit them, push, and redeploy until it succeeds.

## Deployment Validation
After Vercel confirms the deployment is ready:
1. Ensure the production URL is accessible.
2. Mentally verify (or test if possible) that the core application routes are functional and there are no blank pages or glaring routing issues.
3. Confirm that local state/localStorage persistence and themes (like Dark Mode) operate correctly within the deployed context.

## Reporting
When the entire pipeline is complete, conclude your turn by providing the user with a deployment report in the following format:
- **Git commit hash**: [hash]
- **Commit message**: [message]
- **GitHub branch**: [branch]
- **Vercel deployment status**: [Status]
- **Production URL**: [URL]
- **Summary of files changed**: [brief list]
- **Summary of fixes/features**: [brief description]
