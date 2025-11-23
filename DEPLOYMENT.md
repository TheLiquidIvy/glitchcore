# Deployment Guide

## GitHub Actions Workflows

### 1. Build and Test (`build-and-test.yml`)
- Runs on: push to main/master/develop, pull requests
- Tests against Node 18.x and 20.x
- Includes code quality checks and security audits
- **Triggers:** Every push and PR

### 2. Deploy to Azure (`deploy-azure.yml`)
- Builds React app
- Runs tests
- Deploys to Azure Web Apps on main branch only
- **Requires secrets:**
  - `AZURE_WEBAPP_NAME`: Your Azure app name
  - `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure Portal

### 3. Docker Build (`docker-build.yml`)
- Builds Docker image with multi-stage build
- Pushes to GitHub Container Registry
- Automatic caching for faster builds
- **Triggers:** Pushes to main/master

### 4. Security Audit (`security-audit.yml`)
- Runs npm audit
- Checks for vulnerabilities
- Scheduled weekly + on every push
- **Triggers:** Weekly schedule + push/PR

## Azure Pipelines (`azure-pipelines.yml`)

- **Build Stage:** Node build, test, artifact creation
- **Deploy Stage:** Azure Web App deployment (main branch only)
- **Requirements:**
  - Azure Subscription connection
  - App Service created in Azure

## Setup Instructions

### GitHub Actions Setup

1. **Add Secrets to GitHub:**
   - Go to Settings → Secrets and variables → Actions
   - Add `AZURE_WEBAPP_NAME`
   - Add `AZURE_WEBAPP_PUBLISH_PROFILE` (from Azure Portal)

2. **Azure Portal Setup:**
   - Create App Service (Windows or Linux)
   - Download publish profile from Overview → Get publish profile
   - Copy profile content to GitHub secret

3. **Trigger Deploy:**
   - Workflows auto-run on push
   - View in Actions tab
   - Deploy happens automatically on main branch push

### Azure DevOps Setup

1. **Create Pipeline:**
   - Go to Azure DevOps
   - Create new pipeline
   - Select "GitHub" and authorize
   - Select `azure-pipelines.yml`

2. **Add Variables:**
   - Pipeline → Edit → Variables
   - Add: `AZURE_SUBSCRIPTION_ID`
   - Add: `AZURE_WEBAPP_NAME`

3. **Environment Configuration:**
   - Pipelines → Environments
   - Create "production" environment
   - Add approvals if desired

## Docker Deployment

### Build Locally
```bash
docker build -t glitchcore:latest .
docker run -p 5000:5000 glitchcore:latest
```

### Deploy to Container Registry
```bash
docker tag glitchcore:latest ghcr.io/your-username/glitchcore:latest
docker push ghcr.io/your-username/glitchcore:latest
```

### Deploy to Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name glitchcore \
  --image ghcr.io/your-username/glitchcore:latest \
  --ports 5000 \
  --dns-name-label glitchcore
```

## Environment Variables

Create `.env.local` in client folder:
```
REACT_APP_API_URL=https://your-api.com
REACT_APP_ENV=production
```

## Monitoring

- **GitHub Actions:** Settings → Actions → All workflows
- **Azure:** App Service → Activity log → Deployments
- **Logs:** Application Insights (if enabled)

## Troubleshooting

**Deploy fails with 404:**
- Check build artifacts are in correct folder
- Verify `package: client/build` path

**Deployment profile error:**
- Regenerate publish profile from Azure Portal
- Update GitHub secret

**Docker push fails:**
- Check authentication: `docker login ghcr.io`
- Verify token has `write:packages` scope

**Azure Pipeline not triggering:**
- Verify branch name matches trigger
- Check pipeline YAML syntax
- Review pipeline edit history
