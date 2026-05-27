# 1. Pointer Docker vers le daemon de Minikube
Write-Host ">> Connexion au daemon Docker de Minikube..." -ForegroundColor Cyan
& minikube docker-env --shell powershell | Invoke-Expression

# 2. Build des images dans Minikube
Write-Host ">> Build image backend..." -ForegroundColor Cyan
docker build -t voiture-shop-backend:latest ../SpringDataRest

Write-Host ">> Build image frontend..." -ForegroundColor Cyan
docker build -t voiture-shop-frontend:latest ../myapp

# 3. Appliquer les manifests Kubernetes
Write-Host ">> Deploiement sur Kubernetes..." -ForegroundColor Cyan
kubectl apply -f postgres-secret.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# 4. Attendre que les pods soient prêts
Write-Host ">> Attente des pods..." -ForegroundColor Cyan
kubectl rollout status deployment/postgres
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

# 5. Afficher l'état final
Write-Host "`n>> Etat des pods :" -ForegroundColor Green
kubectl get pods

Write-Host "`n>> Etat des services :" -ForegroundColor Green
kubectl get services

Write-Host "`n>> URLs d'acces :" -ForegroundColor Green
Write-Host "Backend  : http://$(minikube ip):30089"
Write-Host "Frontend : http://$(minikube ip):30080"
