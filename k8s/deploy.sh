#!/bin/bash

# 1. Pointer Docker vers le daemon de Minikube
echo ">> Connexion au daemon Docker de Minikube..."
eval $(minikube docker-env)

# 2. Build des images dans Minikube
echo ">> Build image backend..."
docker build -t voiture-shop-backend:latest ../SpringDataRest

echo ">> Build image frontend..."
docker build -t voiture-shop-frontend:latest ../myapp

# 3. Appliquer les manifests Kubernetes
echo ">> Deploiement sur Kubernetes..."
kubectl apply -f postgres-secret.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# 4. Attendre que les pods soient prets
echo ">> Attente des pods..."
kubectl rollout status deployment/postgres
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

# 5. Afficher l'etat final
echo ""
echo ">> Etat des pods :"
kubectl get pods

echo ""
echo ">> Etat des services :"
kubectl get services

echo ""
echo ">> URLs d'acces :"
MINIKUBE_IP=$(minikube ip)
echo "Backend  : http://$MINIKUBE_IP:30089"
echo "Frontend : http://$MINIKUBE_IP:30080"
