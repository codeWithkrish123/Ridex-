# 🚀 CI/CD Pipeline Setup Guide

This guide will help you set up a complete automated CI/CD pipeline for your RideX application.

## 📋 **Pipeline Overview**

The CI/CD pipeline includes 6 automated stages:

1. **Code Quality & Testing** - Linting, security audit, unit tests
2. **Build & Security Scan** - Docker build, container testing, vulnerability scanning
3. **Deploy to Staging** - Automated staging deployment
4. **Deploy to Production** - Production deployment with health checks & rollback
5. **Notify Teams** - Success/failure notifications
6. **Update Documentation** - Auto-update deployment status

## 🔧 **Required GitHub Secrets**

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### **Docker & Registry**
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_ACCESS_TOKEN=your-dockerhub-access-token
```

### **Production Server**
```
SERVER_HOST=your-production-server-ip
SERVER_USER=your-server-username
SERVER_SSH_KEY=your-private-ssh-key
```

### **Staging Server**
```
STAGING_HOST=your-staging-server-ip
STAGING_USER=your-staging-username
STAGING_SSH_KEY=your-staging-ssh-key
STAGING_URL=http://your-staging-url
```

### **Notifications & Documentation**
```
TEAMS_WEBHOOK=your-microsoft-teams-webhook-url
DOCS_REPO=your-documentation-repo
DOCS_TOKEN=your-github-personal-access-token
```

## 📦 **Required Dependencies**

### **Backend Dependencies**
```bash
cd backend
npm install --save-dev jest supertest eslint
```

### **Frontend Dependencies**
```bash
cd RideX
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 🗂️ **File Structure**

Your project should have this structure for CI/CD:

```
RideX-
├── .github/
│   └── workflows/
│       ├── ci-cd.yml          # Main CI/CD pipeline
│       └── deploy.yml         # Legacy deployment (can be removed)
├── backend/
│   ├── tests/
│   │   ├── setup.js          # Jest setup
│   │   └── ride.test.js      # Sample tests
│   ├── jest.config.js        # Jest configuration
│   └── package.json          # Updated with test scripts
├── RideX/
│   ├── src/
│   │   └── test/
│   │       ├── setup.ts      # Vitest setup
│   │       └── GoogleMap.test.tsx # Sample tests
│   ├── vitest.config.ts      # Vitest configuration
│   └── package.json          # Updated with test scripts
├── docker-compose.yaml       # Production configuration
├── docker-compose.staging.yml # Staging configuration
└── CI_CD_SETUP.md            # This file
```

## 🚀 **Pipeline Triggers**

### **Automatic Triggers**
- **Push to main branch**: Full pipeline (test → build → staging → production)
- **Push to develop branch**: Test and build only
- **Pull Request to main**: Test and build only

### **Manual Triggers**
You can manually trigger workflows from GitHub Actions tab.

## 🔍 **Pipeline Stages Explained**

### **1. Code Quality & Testing**
- ✅ Backend unit tests with Jest
- ✅ Frontend unit tests with Vitest
- ✅ ESLint code quality checks
- ✅ TypeScript type checking
- ✅ Security vulnerability audit
- ✅ MongoDB test database setup

### **2. Build & Security Scan**
- ✅ Multi-stage Docker builds
- ✅ Container testing (smoke tests)
- ✅ Trivy security vulnerability scanning
- ✅ SARIF report upload to GitHub Security tab
- ✅ Docker image caching with GitHub Actions cache

### **3. Deploy to Staging**
- ✅ Automated staging deployment
- ✅ Health check verification
- ✅ Integration tests on staging
- ✅ Environment isolation

### **4. Deploy to Production**
- ✅ Blue-green deployment strategy
- ✅ Health check monitoring (45s wait)
- ✅ Automatic rollback on failure
- ✅ Previous version tagging
- ✅ Image cleanup

### **5. Notify Teams**
- ✅ Microsoft Teams notifications
- ✅ Success/failure alerts
- ✅ Deployment status updates

### **6. Update Documentation**
- ✅ Auto-update deployment documentation
- ✅ Version tracking
- ✅ Change log updates

## 🛠️ **Environment Configuration**

### **Production Environment**
```bash
# backend/.env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
GOOGLE_MAPS_API_KEY=your-production-api-key
```

### **Staging Environment**
```bash
# backend/.env.staging
NODE_ENV=staging
PORT=5000
MONGODB_URI=mongodb://your-staging-db
JWT_SECRET=your-staging-jwt-secret
GOOGLE_MAPS_API_KEY=your-staging-api-key
```

### **Frontend Environment**
```bash
# RideX/.env
VITE_API_URL=http://your-production-api-url
```

## 🧪 **Testing Strategy**

### **Backend Tests**
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run lint                # ESLint
```

### **Frontend Tests**
```bash
cd RideX
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run test:ui             # Visual test runner
npm run lint                # ESLint
npm run type-check          # TypeScript check
```

## 🔐 **Security Features**

### **Container Security**
- ✅ Trivy vulnerability scanning
- ✅ Minimal base images (Alpine)
- ✅ Non-root user execution
- ✅ Security-focused Dockerfiles

### **Application Security**
- ✅ API key proxy (backend)
- ✅ Input validation
- ✅ Environment-based configuration
- ✅ JWT token security
- ✅ CORS configuration

### **Deployment Security**
- ✅ SSH key authentication
- ✅ Docker Hub access tokens
- ✅ Environment isolation
- ✅ Health check verification

## 📊 **Monitoring & Observability**

### **Health Checks**
- Backend: `GET /` endpoint
- Frontend: HTTP response check
- Database: MongoDB ping
- Container: Docker health status

### **Logging**
- Winston structured logging (backend)
- Environment-aware log levels
- File-based logging with rotation
- GitHub Actions workflow logs

### **Security Monitoring**
- SARIF reports in GitHub Security tab
- Dependency vulnerability scanning
- Container vulnerability scanning
- Access token monitoring

## 🔄 **Rollback Strategy**

### **Automatic Rollback**
1. Health check failure detection
2. Automatic service shutdown
3. Previous image pull (if available)
4. Service restart with previous version
5. Rollback notification

### **Manual Rollback**
```bash
# On production server
cd /home/user/ridex
docker-compose down
docker pull username/ridex-backend:previous
docker pull username/ridex-frontend:previous
sed -i 's/:latest/:previous/g' docker-compose.yaml
docker-compose up -d
```

## 🚀 **Deployment Process**

### **First Time Setup**
1. Configure all GitHub secrets
2. Install required dependencies
3. Set up staging and production servers
4. Configure environment files
5. Test pipeline with a commit

### **Daily Development**
1. Push to `develop` for testing
2. Review test results and security scans
3. Merge to `main` for production deployment
4. Monitor deployment progress

### **Production Deployment**
1. Code is automatically tested and built
2. Deployed to staging first
3. Verified with integration tests
4. Deployed to production with health checks
5. Team notifications sent

## 📈 **Performance Optimizations**

### **Build Optimizations**
- Docker layer caching
- GitHub Actions cache
- Parallel test execution
- Incremental builds

### **Deployment Optimizations**
- Health check optimization
- Rollback speed improvement
- Image size optimization
- Network transfer optimization

## 🔧 **Troubleshooting**

### **Common Issues**
1. **Test Failures**: Check test setup and environment variables
2. **Build Failures**: Verify Dockerfiles and dependencies
3. **Deployment Failures**: Check server connectivity and secrets
4. **Health Check Failures**: Verify service endpoints and ports

### **Debugging Steps**
1. Check GitHub Actions logs
2. Review test output
3. Verify server logs
4. Check Docker container status
5. Validate environment configuration

## 📞 **Support**

For CI/CD issues:
1. Check this documentation first
2. Review GitHub Actions logs
3. Check server logs
4. Verify all secrets are correctly configured
5. Test individual pipeline stages locally

## 🎯 **Next Steps**

1. **Set up GitHub secrets** using the guide above
2. **Install dependencies** in both backend and frontend
3. **Configure servers** for staging and production
4. **Test pipeline** with a sample commit
5. **Monitor deployments** and adjust as needed

Your CI/CD pipeline is now ready for automated deployments! 🎉
