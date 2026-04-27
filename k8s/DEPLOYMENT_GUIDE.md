# Kubernetes Deployment Guide for ArgoCD

## Problem Solved

Your pods were in `ImagePullBackOff` because:
1. Deployment files referenced wrong image paths (`username/my-app:latest`, `gcr.io/...`)
2. Your CI/CD actually pushes to **GitHub Container Registry (GHCR)**: `ghcr.io/yassineba7/jee_project/`
3. Image paths didn't match between CI/CD and K8s manifests

## Fixed Image Paths

### Backend
- **Old**: `username/my-app:latest` or `gcr.io/jeeapplication-494610/backend:latest`
- **New**: `ghcr.io/yassineba7/jee_project/backend:latest`

### Frontend
- **Old**: `gcr.io/jeeapplication-494610/frontend:latest`
- **New**: `ghcr.io/yassineba7/jee_project/frontend:latest`

## Files Updated

1. ✅ `k8s/backend-deployment.yml` - Updated image path to GHCR
2. ✅ `k8s/frontend-deployment.yml` - Updated image path to GHCR
3. ❌ `k8s/deployment.yaml` - **DELETED** (was duplicate with placeholder)
4. ❌ `k8s/service.yaml` - **DELETED** (services now in deployment files)

## How to Deploy with ArgoCD

### Option 1: Git Push (Recommended)

```bash
# Commit the fixed manifests
git add k8s/
git commit -m "fix: update K8s deployments to use GHCR images"
git push origin main
```

ArgoCD will automatically detect the changes and sync (if auto-sync is enabled).

### Option 2: Manual Sync via ArgoCD UI

1. Open ArgoCD UI
2. Find your application
3. Click **"Sync"**
4. Select **"Synchronize"**

### Option 3: ArgoCD CLI

```bash
argocd app sync <your-app-name>
```

## If Images Are Private (GHCR Authentication)

If your GHCR packages are **private**, you need to create an image pull secret:

### Step 1: Create GitHub Personal Access Token (PAT)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with scope: `read:packages`
3. Copy the token

### Step 2: Create Kubernetes Secret

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=yassineba7 \
  --docker-password=YOUR_GITHUB_PAT \
  --docker-email=your-email@example.com \
  --namespace=gestion-production
```

### Step 3: Update Deployments to Use Secret

Add this to both `backend-deployment.yml` and `frontend-deployment.yml` under `spec.template.spec`:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
        - name: backend
          # ... rest of config
```

## Verify Deployment

### Check Pod Status
```bash
kubectl get pods -n gestion-production
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxx-yyy             1/1     Running   0          2m
frontend-xxx-yyy            1/1     Running   0          2m
mysql-xxx-yyy               1/1     Running   0          5m
```

### Check Image Pull
```bash
kubectl describe pod <pod-name> -n gestion-production
```

Look for:
- ✅ `Successfully pulled image "ghcr.io/yassineba7/jee_project/backend:latest"`
- ❌ `Failed to pull image` (means auth issue or image doesn't exist)

### Check Logs
```bash
kubectl logs -f deployment/backend -n gestion-production
kubectl logs -f deployment/frontend -n gestion-production
```

## Make Your GHCR Packages Public (Alternative to Secrets)

If you want to avoid managing secrets:

1. Go to GitHub → Your Profile → Packages
2. Find `jee_project/backend` and `jee_project/frontend`
3. Click **Package settings**
4. Scroll to **Danger Zone**
5. Click **Change visibility** → **Public**

This allows Kubernetes to pull without authentication.

## ArgoCD Application Configuration

Your ArgoCD app should point to:
- **Repository**: `https://github.com/Yassineba7/jee_project`
- **Path**: `k8s/`
- **Target Revision**: `main` (or `HEAD`)

## Troubleshooting

### Still Getting ImagePullBackOff?

```bash
# Check if image exists and is accessible
docker pull ghcr.io/yassineba7/jee_project/backend:latest

# If it fails, your image is either:
# 1. Private (need imagePullSecret)
# 2. Doesn't exist (check GitHub Actions - did the push succeed?)
# 3. Wrong name (verify in GitHub Packages)
```

### Check GitHub Actions

1. Go to your repo → Actions tab
2. Check latest workflow run
3. Verify "Push backend image" and "Push frontend image" steps succeeded
4. Check the exact image names pushed

### ArgoCD Not Syncing?

```bash
# Force refresh
argocd app get <app-name> --refresh

# Check sync status
argocd app get <app-name>

# View sync history
argocd app history <app-name>
```

## Next Steps

1. ✅ Commit and push the fixed K8s manifests
2. ✅ Wait for ArgoCD to sync (or trigger manually)
3. ✅ Verify pods are running
4. ✅ Test your application endpoints
5. 🔒 (Optional) Set up image pull secrets if packages are private
