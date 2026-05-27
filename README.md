# Voiture Shop — Application Full Stack

Application de gestion et vente de voitures avec conseiller IA intégré.

**Stack :** Spring Boot 4 · React · PostgreSQL · Spring AI (Ollama / llama3.2) · JWT · OAuth2 Google · Docker · Kubernetes

**Fait par :** ANAS BENAMARA

---

## Déploiement — deux modes disponibles

| Mode | Outil | Usage |
|------|-------|-------|
| **Docker Compose** | `docker compose up` | Développement local |
| **Kubernetes** | `kubectl` + Minikube | Déploiement K8s (TP) |

---

## Mode 1 — Docker Compose (développement local)

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/anasxaz/voiture-shop.git
cd voiture-shop
```

### 2. (Optionnel) Configurer Google OAuth2

Créer un fichier `.env` à la racine :

```env
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
```

Sans ce fichier, la connexion par email/mot de passe reste entièrement fonctionnelle.

### 3. Démarrer tous les services

```bash
docker compose up --build
```

### 4. Télécharger le modèle IA (première fois uniquement)

```bash
docker exec voiture_shop_ollama ollama pull llama2
```

### 5. Accéder à l'application

Ouvrir dans le navigateur : **http://localhost:3000**

---

## Mode 2 — Kubernetes avec Minikube

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Git Bash (Windows)

### 1. Démarrer Minikube

```bash
minikube start --memory=4096 --cpus=2
```

### 2. Cloner et préparer

```bash
git clone https://github.com/anasxaz/voiture-shop.git
cd voiture-shop/k8s
```

### 3. Configurer Google OAuth2 (optionnel)

Créer `k8s/google-secret.yaml` (ce fichier n'est pas dans le repo) :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: google-secret
type: Opaque
stringData:
  GOOGLE_CLIENT_ID: "votre-client-id"
  GOOGLE_CLIENT_SECRET: "votre-client-secret"
```

### 4. Build et déploiement

```bash
# Pointer Docker vers Minikube
eval $(minikube docker-env)

# Build des images
docker build -t voiture-shop-backend:latest ../SpringDataRest
docker build -t voiture-shop-frontend:latest ../myapp

# Déployer
kubectl apply -f postgres-secret.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f google-secret.yaml        # si OAuth configuré
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ollama-deployment.yaml

# Attendre que tout soit prêt
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend
kubectl rollout status deployment/ollama
```

### 5. Télécharger le modèle IA

```bash
kubectl exec deployment/ollama -- ollama pull llama3.2:1b
```

> Le modèle fait ~1.3 Go. Cette étape n'est nécessaire qu'une fois.

### 6. Accéder à l'application

```bash
kubectl port-forward service/frontend 3000:80
```

Ouvrir dans le navigateur : **http://localhost:3000**

> **Note :** Utiliser `port-forward` (pas `minikube service`) pour que Google OAuth fonctionne sur un port fixe.

---

## Comptes par défaut

| Rôle  | Identifiant | Mot de passe |
|-------|-------------|--------------|
| Admin | `admin`     | `admin123`   |
| User  | `user`      | `user123`    |

Tout visiteur peut créer un compte depuis la page de connexion, ou se connecter avec Google.

> **Note Google OAuth :** L'application est en mode "Test". Contactez le développeur pour ajouter votre email comme testeur (Google Cloud Console → OAuth consent screen → Test users).

---

## Fonctionnalités

### Utilisateur
- Inscription / Connexion (email + mot de passe ou Google OAuth2)
- Parcourir le catalogue avec filtres (prix, année) et tri
- Voir le détail d'une voiture
- Envoyer une demande de contact "Je suis intéressé(e)"
- **Conseiller IA** : assistant conversationnel basé sur le budget et les préférences, alimenté par le catalogue en temps réel

### Administrateur
- **Tableau de bord** : statistiques (total voitures, demandes en attente, prix moyen)
- Ajouter / Modifier / Supprimer des voitures
- Gérer les demandes de contact (traiter / supprimer)

---

## Architecture

```
voiture-shop/
├── SpringDataRest/        ← Backend Spring Boot (port 8089)
│   ├── Dockerfile         ← Build multi-stage Maven → JRE Alpine
│   └── src/
├── myapp/                 ← Frontend React + Nginx
│   ├── Dockerfile         ← Build Node → Nginx Alpine
│   └── nginx.conf         ← Reverse proxy + routing SPA
├── k8s/                   ← Manifests Kubernetes
│   ├── postgres-secret.yaml
│   ├── postgres-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ollama-deployment.yaml
│   └── deploy.sh          ← Script de déploiement automatisé
├── docker-compose.yml     ← Mode développement local
└── README.md
```

---

## Arrêter l'application

### Docker Compose
```bash
docker compose down          # Arrêter
docker compose down -v       # Arrêter + supprimer les données
```

### Kubernetes
```bash
kubectl delete -f .          # Supprimer tous les pods/services
minikube stop                # Arrêter Minikube
```
