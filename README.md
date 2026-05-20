# Voiture Shop — Application Full Stack

Application de gestion et vente de voitures avec conseiller IA intégré.

**Stack :** Spring Boot 4 · React · PostgreSQL · Spring AI (Ollama) · JWT · OAuth2 Google

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- [Ollama](https://ollama.com/) installé avec le modèle `llama2` :
  ```bash
  ollama pull llama2
  ollama serve
  ```

---

## Lancer l'application

### 1. Cloner le projet

```bash
git clone https://github.com/anasxaz/voiture-shop.git
cd Voiture-Shop
```

### 2. (Optionnel) Configurer Google OAuth2

Créer un fichier `.env` à la racine :

```env
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
```

Sans ce fichier, la connexion par email/mot de passe reste fonctionnelle.

### 3. Démarrer les 3 services

```bash
docker compose up --build
```

> Le premier lancement prend quelques minutes (compilation Maven + npm build).

### 4. Accéder à l'application

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:8089       |
| Base de données | localhost:5432 (voituredb) |

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
- **Conseiller IA** : assistant conversationnel basé sur le budget et les préférences, alimenté par le catalogue en temps réel

### Administrateur
- **Tableau de bord** : statistiques (total voitures, demandes en attente, prix moyen, voiture la plus/moins chère)
- Ajouter / Modifier / Supprimer des voitures
- Gérer les demandes de contact (traiter / supprimer)

---

## Architecture

```
Voiture-Shop/
├── SpringDataRest/   ← Backend Spring Boot (port 8089)
│   └── Dockerfile    ← Build multi-stage Maven → JRE Alpine
├── myapp/            ← Frontend React (port 3000)
│   ├── Dockerfile    ← Build Node → Nginx Alpine
│   └── nginx.conf    ← Routing SPA
├── docker-compose.yml
└── README.md
```

---

## Arrêter l'application

```bash
docker compose down
```

Pour supprimer aussi les données PostgreSQL :

```bash
docker compose down -v
```
