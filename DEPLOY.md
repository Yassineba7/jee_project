# Déploiement — Docker & Cloud

## Architecture

```
Internet
   │
   ▼
Nginx :80/:443
   ├── /api/*  ──► Backend (Spring Boot :8080)
   │                    │
   │               MySQL :3306
   └── /*      ──► Frontend (Angular SSR :4000)
```

---

## 1. Déploiement local avec Docker Compose

### Prérequis
- Docker Desktop installé et démarré
- Git

### Étapes

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd gestion-production

# 2. Créer le fichier .env
cp .env.example .env
# Éditez .env et changez DB_PASSWORD

# 3. Lancer tous les services
docker compose up --build -d

# 4. Vérifier que tout tourne
docker compose ps
docker compose logs -f
```

L'application sera disponible sur **http://localhost:4000**  
L'API Swagger sur **http://localhost:8080/swagger-ui.html**

### Commandes utiles

```bash
# Arrêter
docker compose down

# Arrêter + supprimer les données MySQL
docker compose down -v

# Voir les logs d'un service
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild un seul service
docker compose up --build backend -d
```

---

## 2. Déploiement sur un VPS (DigitalOcean / OVH / Hetzner)

### Prérequis sur le serveur
```bash
# Ubuntu 22.04
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
```

### Étapes

```bash
# 1. Cloner le projet sur le serveur
git clone <votre-repo>
cd gestion-production

# 2. Configurer les variables d'environnement
cp .env.example .env
nano .env
# Remplir :
#   DB_PASSWORD=mot_de_passe_fort
#   CORS_ALLOWED_ORIGINS=https://votre-domaine.com
#   GITHUB_REPOSITORY=votre-user/votre-repo

# 3. (Optionnel) Pointer votre domaine vers l'IP du serveur dans votre DNS

# 4. Lancer avec les images pré-buildées
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### HTTPS avec Let's Encrypt (Certbot)

```bash
# Installer Certbot
sudo apt install -y certbot

# Obtenir un certificat (arrêter nginx d'abord)
docker compose -f docker-compose.prod.yml stop nginx
sudo certbot certonly --standalone -d votre-domaine.com

# Copier les certificats
sudo mkdir -p nginx/certs
sudo cp /etc/letsencrypt/live/votre-domaine.com/fullchain.pem nginx/certs/
sudo cp /etc/letsencrypt/live/votre-domaine.com/privkey.pem nginx/certs/
sudo chown -R $USER:$USER nginx/certs

# Décommenter le bloc HTTPS dans nginx/nginx.conf
# Puis relancer
docker compose -f docker-compose.prod.yml up -d nginx
```

---

## 3. Déploiement sur Railway

Railway peut déployer chaque service séparément depuis GitHub.

### Backend

1. Aller sur [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Sélectionner votre repo, **Root Directory** : `production-backend`
3. Railway détecte le `Dockerfile` automatiquement
4. Ajouter un service **MySQL** depuis le catalogue Railway
5. Variables d'environnement à configurer :
   ```
   SPRING_PROFILES_ACTIVE=prod
   DB_URL=${{MySQL.MYSQL_URL}}
   DB_USERNAME=${{MySQL.MYSQL_USER}}
   DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
   CORS_ALLOWED_ORIGINS=https://<url-frontend>.railway.app
   ```

### Frontend

1. New Service → Deploy from GitHub, **Root Directory** : `production-frontend`
2. Variables :
   ```
   PORT=4000
   ```
3. Une fois déployé, copier l'URL publique et la mettre dans `CORS_ALLOWED_ORIGINS` du backend

---

## 4. Déploiement sur Render

### Backend (Web Service)

1. [render.com](https://render.com) → New Web Service → Connect GitHub
2. **Root Directory** : `production-backend`
3. **Dockerfile** détecté automatiquement
4. Créer une base **MySQL** (ou utiliser PlanetScale/Aiven)
5. Variables d'environnement :
   ```
   SPRING_PROFILES_ACTIVE=prod
   DB_URL=jdbc:mysql://<host>:3306/gestion_production?useSSL=true
   DB_USERNAME=<user>
   DB_PASSWORD=<password>
   CORS_ALLOWED_ORIGINS=https://<frontend>.onrender.com
   ```

### Frontend (Web Service)

1. New Web Service → **Root Directory** : `production-frontend`
2. Variables :
   ```
   PORT=4000
   ```

---

## 5. CI/CD avec GitHub Actions

Le workflow `.github/workflows/docker-build-push.yml` :
- Se déclenche à chaque push sur `main`
- Build les images Docker backend et frontend
- Les pousse sur **GitHub Container Registry** (ghcr.io)

### Configuration requise

Aucune configuration manuelle — le workflow utilise `GITHUB_TOKEN` automatiquement.

Pour déployer automatiquement sur votre VPS après le push, ajoutez ce job au workflow :

```yaml
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/gestion-production
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
```

Secrets GitHub à configurer : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`

---

## Résumé des ports

| Service  | Port interne | Port exposé (local) |
|----------|-------------|---------------------|
| MySQL    | 3306        | 3306                |
| Backend  | 8080        | 8080                |
| Frontend | 4000        | 4000                |
| Nginx    | 80/443      | 80/443              |
