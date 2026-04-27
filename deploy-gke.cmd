@echo off
echo ============================================
echo   Deploiement GKE - Gestion Production
echo ============================================

set PROJECT_ID=jeeapplication-494610
set ZONE=europe-west1-b
set CLUSTER=gestion-production-cluster

echo.
echo [1/6] Configuration Docker pour GCR...
gcloud auth configure-docker --quiet

echo.
echo [2/6] Build image Backend...
docker build -t gcr.io/%PROJECT_ID%/backend:latest ./backend

echo.
echo [3/6] Build image Frontend...
docker build -t gcr.io/%PROJECT_ID%/frontend:latest ./frontend

echo.
echo [4/6] Push images sur Google Container Registry...
docker push gcr.io/%PROJECT_ID%/backend:latest
docker push gcr.io/%PROJECT_ID%/frontend:latest

echo.
echo [5/6] Connexion au cluster GKE...
gcloud container clusters get-credentials %CLUSTER% --zone=%ZONE% --project=%PROJECT_ID%

echo.
echo [6/6] Deploiement sur Kubernetes...
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/mysql-deployment.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml

echo.
echo Attente du demarrage des pods (60s)...
timeout /t 60 /nobreak

echo.
echo ============================================
echo   Status des pods :
kubectl get pods -n gestion-production
echo.
echo   Services (IP publique) :
kubectl get services -n gestion-production
echo ============================================
echo.
echo L'IP publique apparait dans la colonne EXTERNAL-IP du service frontend.
echo Si elle affiche "pending", attendez 1-2 minutes et relancez :
echo   kubectl get services -n gestion-production
