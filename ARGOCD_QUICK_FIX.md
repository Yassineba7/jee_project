# ArgoCD ImagePullBackOff - Quick Fix

## ✅ What Was Fixed

Your Kubernetes deployments were pointing to **wrong image registries**:

| Component | ❌ Old (Wrong) | ✅ New (Correct) |
|-----------|---------------|------------------|
| Backend | `username/my-app:latest` or `gcr.io/...` | `ghcr.io/yassineba7/jee_project/backend:latest` |
| Frontend | `gcr.io/jeeapplication-494610/frontend:latest` | `ghcr.io/yassineba7/jee_project/frontend:latest` |

## 🚀 Deploy the Fix

### Step 1: Commit and Push
```bash
git add .
git commit -m "fix: update K8s manifests to use correct GHCR image paths"
git push origin main
```

### Step 2: Sync ArgoCD

**Option A - Auto Sync (if enabled):**
- ArgoCD will detect changes automatically within 3 minutes

**Option B - Manual Sync via UI:**
1. Open ArgoCD dashboard
2. Click your application
3. Click **"SYNC"** button
4. Click **"SYNCHRONIZE"**

**Option C - CLI:**
```bash
argocd app sync <your-app-name>
```

### Step 3: Verify
```bash
# Check pods are running
kubectl get pods -n gestion-production

# Should show:
# backend-xxx    1/1  Running
# frontend-xxx   1/1  Running
```

## 🔐 If Images Are Private

Your GHCR packages might be private. Two options:

### Option 1: Make Packages Public (Easiest)
1. Go to https://github.com/Yassineba7?tab=packages
2. Click on `backend` package → **Package settings**
3. Scroll down → **Change visibility** → **Public**
4. Repeat for `frontend` package

### Option 2: Create Image Pull Secret
```bash
# Create GitHub PAT with 'read:packages' scope
# Then run:
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=yassineba7 \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=your-email@example.com \
  --namespace=gestion-production
```

Then add to both deployment files under `spec.template.spec`:
```yaml
imagePullSecrets:
  - name: ghcr-secret
```

## 📋 Files Changed

- ✅ `k8s/backend-deployment.yml` - Updated image path
- ✅ `k8s/frontend-deployment.yml` - Updated image path  
- ✅ `.github/workflows/ci.yml` - Fixed deploy job references
- ❌ `k8s/deployment.yaml` - Deleted (duplicate)
- ❌ `k8s/service.yaml` - Deleted (merged into deployments)

## 🔍 Troubleshooting

### Still failing?
```bash
# Test if you can pull the image manually
docker pull ghcr.io/yassineba7/jee_project/backend:latest

# If it fails with "unauthorized", your packages are private
# → Use one of the solutions above
```

### Check GitHub Actions
1. Go to https://github.com/Yassineba7/jee_project/actions
2. Verify latest workflow succeeded
3. Check "Push backend image" step completed

### View Pod Details
```bash
kubectl describe pod <pod-name> -n gestion-production
# Look for "Successfully pulled image" or error messages
```

## 📚 Full Documentation

See `k8s/DEPLOYMENT_GUIDE.md` for complete details.
