# Voiture Shop — Application Full Stack

Application de gestion et vente de voitures avec conseiller IA intégré.

**Stack :** Spring Boot 4 · React · PostgreSQL · Spring AI (Ollama / llama2) · JWT · OAuth2 Google
**Fait par :** ANAS BENAMARA

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- Git

---

## Lancer l'application

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

> **Note Google OAuth :** L'application Google OAuth est en mode "Test". Seuls les comptes ajoutés manuellement comme testeurs peuvent l'utiliser. Pour tester cette fonctionnalité, contactez le développeur afin qu'il ajoute votre adresse email via Google Cloud Console → OAuth consent screen → Test users.

### 3. Démarrer tous les services

```bash
docker compose up --build
```

> Le premier lancement prend plusieurs minutes :
> - Compilation Maven du backend
> - Build npm du frontend
> - Téléchargement des images Docker

### 4. Télécharger le modèle IA (première fois uniquement)

Une fois les conteneurs démarrés, exécuter cette commande dans un autre terminal :

```bash
docker exec voiture_shop_ollama ollama pull llama2
```

> Le modèle llama2 fait environ 3.8 Go. Cette étape n'est nécessaire qu'une seule fois — il est ensuite conservé dans un volume Docker.

### 5. Accéder à l'application

Ouvrir dans le navigateur : **http://localhost:3000**

> - `localhost:8089` → API REST (utilisée en arrière-plan, pas à ouvrir directement)
> - `localhost:11434` → Ollama (IA, pas à ouvrir directement)
> - `localhost:5432` → PostgreSQL (accessible via un client SQL comme DBeaver)

---

## Comptes par défaut

| Rôle  | Identifiant | Mot de passe |
|-------|-------------|--------------|
| Admin | `admin`     | `admin123`   |

Tout visiteur peut créer un compte utilisateur depuis la page de connexion.

---

## Fonctionnalités

### Utilisateur
- Inscription / Connexion (email + mot de passe ou Google)
- Parcourir le catalogue avec filtres (prix, année) et tri
- Voir le détail d'une voiture
- Envoyer une demande de contact "Je suis intéressé(e)"
- **Conseiller IA** : assistant conversationnel basé sur le budget et les préférences, alimenté par le catalogue en temps réel (nécessite le modèle llama2)

### Administrateur
- **Tableau de bord** : statistiques (total voitures, demandes en attente, prix moyen, voiture la plus/moins chère)
- Ajouter / Modifier / Supprimer des voitures
- Gérer les demandes de contact (traiter / supprimer)

---

## Architecture

```
voiture-shop/
├── SpringDataRest/   ← Backend Spring Boot (port 8089)
│   └── Dockerfile    ← Build multi-stage Maven → JRE Alpine
├── myapp/            ← Frontend React (port 3000)
│   ├── Dockerfile    ← Build Node → Nginx Alpine
│   └── nginx.conf    ← Routing SPA
├── docker-compose.yml  ← 4 services : PostgreSQL, Ollama, Backend, Frontend
└── README.md
```

---

## Arrêter l'application

```bash
docker compose down
```

Pour supprimer aussi les données PostgreSQL et le modèle IA :

```bash
docker compose down -v
```

Pour tout supprimer (données + images Docker) et repartir de zéro :

```bash
docker compose down -v --rmi all
```
