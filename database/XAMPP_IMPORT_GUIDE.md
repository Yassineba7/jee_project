# How to Import Database into XAMPP MySQL

## 📋 Prerequisites

1. ✅ XAMPP installed on your computer
2. ✅ MySQL service running in XAMPP Control Panel
3. ✅ The SQL file: `database/create_database.sql`

---

## 🚀 Method 1: Using phpMyAdmin (Easiest)

### Step 1: Start XAMPP Services
1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache** (if you want to use phpMyAdmin)
3. Click **Start** next to **MySQL**
4. Wait until both show "Running" status

### Step 2: Open phpMyAdmin
1. Click **Admin** button next to MySQL in XAMPP Control Panel
   - OR go to: http://localhost/phpmyadmin
2. You should see the phpMyAdmin interface

### Step 3: Import the Database
1. In phpMyAdmin, click on the **SQL** tab at the top
2. Click **Choose File** or drag and drop
3. Select the file: `database/create_database.sql`
4. Click **Go** button at the bottom
5. Wait for the import to complete

### Step 4: Verify Import
1. Look for the database `gestion_production` in the left sidebar
2. Click on it to expand
3. You should see 5 tables:
   - ✅ machine
   - ✅ technicien
   - ✅ produit
   - ✅ maintenance
   - ✅ ordre_fabrication
4. Click on each table and select **Browse** to see the sample data

---

## 🖥️ Method 2: Using MySQL Command Line

### Step 1: Open Command Prompt
1. Press `Win + R`
2. Type `cmd` and press Enter

### Step 2: Navigate to XAMPP MySQL Directory
```cmd
cd C:\xampp\mysql\bin
```

**Note:** If XAMPP is installed in a different location, adjust the path accordingly.

### Step 3: Login to MySQL
```cmd
mysql -u root -p
```

When prompted for password:
- If you haven't set a password, just press **Enter**
- If you have a password, type it and press **Enter**

### Step 4: Import the SQL File
```sql
source C:\Users\yassi\Projects\gestion-production\database\create_database.sql
```

**Or** exit MySQL first and run:
```cmd
mysql -u root -p < C:\Users\yassi\Projects\gestion-production\database\create_database.sql
```

### Step 5: Verify Import
```cmd
mysql -u root -p
```

Then in MySQL:
```sql
USE gestion_production;
SHOW TABLES;
SELECT COUNT(*) FROM machine;
SELECT COUNT(*) FROM technicien;
SELECT COUNT(*) FROM produit;
SELECT COUNT(*) FROM maintenance;
SELECT COUNT(*) FROM ordre_fabrication;
```

You should see:
- 5 machines
- 5 techniciens
- 5 produits
- 5 maintenances
- 5 ordres de fabrication

---

## 🔧 Method 3: Copy-Paste SQL in phpMyAdmin

If the file import doesn't work:

### Step 1: Open the SQL File
1. Open `database/create_database.sql` in a text editor (Notepad, VS Code, etc.)
2. Select all content (Ctrl + A)
3. Copy (Ctrl + C)

### Step 2: Execute in phpMyAdmin
1. Go to http://localhost/phpmyadmin
2. Click on the **SQL** tab
3. Paste the SQL content into the text area (Ctrl + V)
4. Click **Go**

---

## ✅ Verify Your Backend Configuration

After importing, make sure your backend is configured to use XAMPP MySQL:

### Check `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_production?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

**Important:**
- `spring.datasource.password=` should be **empty** if you haven't set a MySQL root password in XAMPP
- If you have set a password, add it: `spring.datasource.password=your_password`

---

## 🚀 Run Your Backend

After importing the database:

### Option 1: Run with Maven
```bash
cd backend
mvn spring-boot:run
```

### Option 2: Run with IDE
1. Open the project in IntelliJ IDEA or Eclipse
2. Navigate to `ProductionBackendApplication.java`
3. Right-click → Run

### Option 3: Run the JAR
```bash
cd backend
mvn clean package -DskipTests
java -jar target/production-backend-0.0.1-SNAPSHOT.jar
```

---

## 🔍 Troubleshooting

### Problem: "Access denied for user 'root'@'localhost'"

**Solution:** Set MySQL password in application.properties
```properties
spring.datasource.password=your_xampp_mysql_password
```

### Problem: "Unknown database 'gestion_production'"

**Solution:** The database wasn't created. Re-run the SQL script or create manually:
```sql
CREATE DATABASE gestion_production;
```

### Problem: "Communications link failure"

**Solution:** MySQL is not running
1. Open XAMPP Control Panel
2. Start MySQL service
3. Wait until it shows "Running"

### Problem: "Table doesn't exist"

**Solution:** Tables weren't created. Re-import the SQL file completely.

### Problem: phpMyAdmin shows "Cannot connect to MySQL server"

**Solution:**
1. Stop MySQL in XAMPP
2. Wait 5 seconds
3. Start MySQL again
4. Refresh phpMyAdmin

---

## 📊 Sample Data Included

The SQL script includes sample data:

### Machines (5 records)
- Machine A - Découpe (Opérationnelle)
- Machine B - Assemblage (Opérationnelle)
- Machine C - Peinture (En maintenance)
- Machine D - Emballage (Opérationnelle)
- Machine E - Contrôle qualité (En panne)

### Techniciens (5 records)
- Ahmed Benali
- Fatima Zahra
- Mohamed Alami
- Khadija Idrissi
- Youssef Tazi

### Produits (5 records)
- Pièce métallique A (Stock: 150)
- Pièce plastique B (Stock: 200)
- Assemblage complet C (Stock: 50)
- Peinture industrielle (Stock: 80)
- Emballage carton (Stock: 300)

### Maintenances (5 records)
- Various maintenance records for different machines

### Ordres de Fabrication (5 records)
- Production orders with different statuses

---

## 🎯 Quick Start Checklist

- [ ] XAMPP MySQL is running
- [ ] Database imported via phpMyAdmin or command line
- [ ] Database `gestion_production` exists
- [ ] 5 tables created with sample data
- [ ] Backend `application.properties` configured correctly
- [ ] Backend application started successfully
- [ ] Can access http://localhost:8080/swagger-ui.html

---

## 📞 Need Help?

If you encounter issues:
1. Check XAMPP MySQL error logs: `C:\xampp\mysql\data\mysql_error.log`
2. Check backend logs in the console
3. Verify MySQL is running on port 3306
4. Make sure no other MySQL instance is running

---

**Status**: Database script ready ✅  
**Location**: `database/create_database.sql`  
**Next**: Import using one of the methods above
