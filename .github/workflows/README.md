# GitHub Actions Workflows

## Workflows Included

### 1. 🚀 Build and Test (`build-and-test.yml`)
Tests your code on every push and PR
- Node.js 18.x and 20.x testing
- Build verification
- Automated testing
- Security audit integration

### 2. 📦 Deploy to Azure (`deploy-azure.yml`)
Deploys to Azure Web Apps on main branch
- Auto-builds React app
- Runs tests before deploy
- Deploys only on main branch
- Requires: AZURE_WEBAPP_PUBLISH_PROFILE secret

### 3. 🐳 Docker Build (`docker-build.yml`)
Builds and pushes Docker images
- Multi-stage Dockerfile included
- Pushes to GitHub Container Registry
- Automatic caching
- Semantic versioning

### 4. 🔒 Security Audit (`security-audit.yml`)
Weekly vulnerability scanning
- npm audit checks
- Production dependency scan
- Weekly schedule + on push

## Quick Setup

1. **GitHub Secrets** (Settings → Secrets and variables → Actions)
   - `AZURE_WEBAPP_NAME`: Your Azure app name
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: From Azure Portal

2. **Push to main** → Workflows auto-run!

3. **View Status** → Actions tab shows all workflow runs
