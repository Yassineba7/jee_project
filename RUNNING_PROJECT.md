# 🚀 Project is Running Successfully!

## ✅ All Services Status

| Service | Status | Port | Container |
|---------|--------|------|-----------|
| **MySQL** | ✅ Running (healthy) | 3306 | `gestion-mysql` |
| **Backend** | ✅ Running (healthy) | 8080 | `gestion-backend` |
| **Frontend** | ✅ Running | 4200 | `gestion-frontend` |

---

## 🌐 Access URLs

### Frontend (Angular Application)
**URL**: http://localhost:4200

This is your main application interface where you can:
- View and manage machines
- Manage maintenance records
- Handle production orders
- Manage products and technicians

### Backend API (Spring Boot)
**Base URL**: http://localhost:8080

**Swagger UI (API Documentation)**: http://localhost:8080/swagger-ui.html
- Interactive API documentation
- Test all endpoints directly from the browser
- View request/response schemas

**Health Check**: http://localhost:8080/actuator/health
- Check if backend is running
- Returns: `{"status":"UP"}`

**Actuator Endpoints**: http://localhost:8080/actuator
- Health: `/actuator/health`
- Info: `/actuator/info`
- Metrics: `/actuator/metrics`

### MySQL Database
**Connection Details:**
- Host: `localhost`
- Port: `3306`
- Database: `gestion_production`
- Username: `root`
- Password: `rootpassword`

**Connect via MySQL Workbench or CLI:**
```bash
mysql -h localhost -P 3306 -u root -prootpassword gestion_production
```

---

## 📋 Available API Endpoints

### Machines
- `GET    /api/machines` - Get all machines
- `GET    /api/machines/{id}` - Get machine by ID
- `POST   /api/machines` - Create new machine
- `PUT    /api/machines/{id}` - Update machine
- `DELETE /api/machines/{id}` - Delete machine

### Maintenance
- `GET    /api/maintenances` - Get all maintenance records
- `GET    /api/maintenances/{id}` - Get maintenance by ID
- `POST   /api/maintenances` - Create new maintenance
- `PUT    /api/maintenances/{id}` - Update maintenance
- `DELETE /api/maintenances/{id}` - Delete maintenance

### Technicians
- `GET    /api/techniciens` - Get all technicians
- `GET    /api/techniciens/{id}` - Get technician by ID
- `POST   /api/techniciens` - Create new technician
- `PUT    /api/techniciens/{id}` - Update technician
- `DELETE /api/techniciens/{id}` - Delete technician

### Products
- `GET    /api/produits` - Get all products
- `GET    /api/produits/{id}` - Get product by ID
- `POST   /api/produits` - Create new product
- `PUT    /api/produits/{id}` - Update product
- `DELETE /api/produits/{id}` - Delete product

### Production Orders
- `GET    /api/ordres-fabrication` - Get all orders
- `GET    /api/ordres-fabrication/{id}` - Get order by ID
- `POST   /api/ordres-fabrication` - Create new order
- `PUT    /api/ordres-fabrication/{id}` - Update order
- `DELETE /api/ordres-fabrication/{id}` - Delete order

---

## 🛠️ Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker logs -f gestion-backend

# Frontend only
docker logs -f gestion-frontend

# MySQL only
docker logs -f gestion-mysql
```

### Stop the Project
```bash
docker-compose down
```

### Restart the Project
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose down
docker-compose up --build
```

### View Running Containers
```bash
docker ps
```

### Access Database
```bash
docker exec -it gestion-mysql mysql -u root -prootpassword gestion_production
```

---

## 📊 Sample Data Included

The database is already populated with sample data:

### Machines (5)
1. Machine A - Découpe (Opérationnelle)
2. Machine B - Assemblage (Opérationnelle)
3. Machine C - Peinture (En maintenance)
4. Machine D - Emballage (Opérationnelle)
5. Machine E - Contrôle qualité (En panne)

### Techniciens (5)
1. Ahmed Benali - Mécanique, Électronique
2. Fatima Zahra - Hydraulique, Pneumatique
3. Mohamed Alami - Électricité, Automatisme
4. Khadija Idrissi - Informatique industrielle
5. Youssef Tazi - Maintenance préventive

### Produits (5)
1. Pièce métallique A (Stock: 150)
2. Pièce plastique B (Stock: 200)
3. Assemblage complet C (Stock: 50)
4. Peinture industrielle (Stock: 80)
5. Emballage carton (Stock: 300)

### Maintenances (5)
- Various maintenance records for different machines

### Ordres de Fabrication (5)
- Production orders with statuses: En attente, En cours, Terminé

---

## 🔍 Testing the Application

### Test Backend API
```bash
# Get all machines
curl http://localhost:8080/api/machines

# Get specific machine
curl http://localhost:8080/api/machines/1

# Create new machine (example)
curl -X POST http://localhost:8080/api/machines \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Machine Test",
    "etat": "Opérationnelle",
    "maintenanceProchaine": "2026-07-01"
  }'
```

### Test Frontend
1. Open browser to http://localhost:4200
2. Navigate through the application
3. View machines, products, orders, etc.
4. Test CRUD operations

### Test Swagger UI
1. Open http://localhost:8080/swagger-ui.html
2. Expand any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. View response

---

## 🔧 Troubleshooting

### Port Already in Use
If you get "port already in use" error:
```bash
# Find and kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Backend Not Connecting to MySQL
```bash
# Check MySQL is healthy
docker ps

# View MySQL logs
docker logs gestion-mysql

# Restart backend
docker-compose restart backend
```

### Frontend Not Loading
```bash
# Check nginx logs
docker logs gestion-frontend

# Restart frontend
docker-compose restart frontend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

---

## 📱 Quick Links

- **Frontend App**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **Actuator**: http://localhost:8080/actuator

---

## ✅ Success Checklist

- [x] MySQL database running with sample data
- [x] Backend API running on port 8080
- [x] Frontend application running on port 4200
- [x] All health checks passing
- [x] API endpoints accessible
- [x] Swagger UI available
- [x] CORS configured for frontend-backend communication

**Status**: 🟢 All systems operational!

---

**Last Updated**: June 11, 2026  
**Environment**: Local Development (Docker Compose)
