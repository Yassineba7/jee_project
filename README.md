# Gestion de Production — Full Stack App

> Angular 21 · Spring Boot 3 · MySQL 8 · Docker · Kubernetes (GKE)

## 🚀 CI/CD Pipeline Status

![CI/CD](https://github.com/Yassineba7/jee_project/actions/workflows/ci.yml/badge.svg)

---

## 📦 Project Structure

```
jee_project/
├── backend/          # Spring Boot REST API (Java 17)
├── frontend/         # Angular 21 SPA (TypeScript)
├── k8s/              # Kubernetes manifests (GKE)
├── nginx/            # Reverse proxy config
├── .github/workflows # CI/CD — GitHub Actions
├── docker-compose.yml
└── DEPLOY.md         # Full deployment guide
```

---

## ⚡ Quick Start (Docker)

```bash
cp .env.example .env
docker compose up --build -d
```

App → **http://localhost:4000**
API → **http://localhost:8080/swagger-ui.html**

---

## ☁️ Live on GKE

**http://104.199.58.8**

---

## 🔧 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | Angular 21 + Material   |
| Backend    | Spring Boot 3 + JPA     |
| Database   | MySQL 8.0               |
| Container  | Docker + Nginx          |
| Orchestration | Kubernetes (GKE)     |
| CI/CD      | GitHub Actions          |
| Monitoring | Prometheus + Grafana    |

---

## 📊 Monitoring

```bash
# Deploy monitoring stack
kubectl apply -f k8s/monitoring.yaml

# Access Grafana
kubectl port-forward svc/grafana 3000:3000 -n monitoring
# → http://localhost:3000  (admin / admin)
```

---

## 📖 Full Deployment Guide

See [DEPLOY.md](./DEPLOY.md) for Docker, VPS, Railway, Render and GKE instructions.

---

*Last updated: trigger CI pipeline — $(date)*
