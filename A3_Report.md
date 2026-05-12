# DSO101 Assignment 3 Report (Task 3)

Date of submission: 29 April  
Programme: Bachelor of Engineering in Software Engineering (SWE)

This report describes the CI/CD pipeline based on GitHub Actions that was built for the To-Do application in this repository. The purpose of the assignment was to automate Docker image build and push, secure secret handling, and Render deployment preparation.

## Scope

This report documents the implementation completed for **Task 3** of Assignment 3: setting up GitHub Actions for automated Docker image build/push and Render redeployment using secure repository secrets.

## Steps Taken

1. Created the GitHub Actions workflow file at `.github/workflows/deploy.yml`.
2. Configured the workflow trigger on push to `main`.
3. Added DockerHub login in the workflow using repository secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
4. Added build and push steps for two images:
   - Backend image from `./backend`
   - Frontend image from `./frontend`
5. Added two Render webhook deploy steps in the workflow:
   - `RENDER_DEPLOY_HOOK_BACKEND`
   - `RENDER_DEPLOY_HOOK_FRONTEND`
6. Added required GitHub repository secrets in **Settings > Secrets and variables > Actions**.
7. Pushed changes to GitHub and validated that workflow jobs run automatically.

## Challenges Faced

- Initial workflow runs failed on webhook deployment because the Render secret values were empty, resulting in:
  `curl: (3) URL rejected: Malformed input to a URL function`.
- Secret naming mismatch caused webhook URLs not to resolve in Actions.

## Learning Outcomes

- Learned how to design a multi-service GitHub Actions pipeline for one repository.
- Learned secure credential handling using GitHub Secrets (without hardcoding tokens).
- Understood that DockerHub image push alone does not auto-redeploy Render in this setup.
- Learned to trigger Render redeployment reliably using service-specific deploy webhooks.

## Screenshots

- [7.png](7.png): Successful GitHub Actions workflow.
- [6.png](6.png): DockerHub image push result.
- [1.png](1.png): Render backend deployment/service view.
- [2.png](2.png): Render frontend deployment/service view.

## Render Deployment Links

- Backend: https://be-todo-02240340.onrender.com
- Frontend: https://fe-todo-02240340.onrender.com
