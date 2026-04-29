# Database Setup for Gestion Production

This folder contains everything you need to set up the MySQL database for the Gestion Production application.

## 📁 Files

- **`create_database.sql`** - Complete database schema with sample data
- **`import_to_xampp.bat`** - Windows batch script for automatic import
- **`import_to_xampp.ps1`** - PowerShell script for automatic import
- **`XAMPP_IMPORT_GUIDE.md`** - Detailed step-by-step guide
- **`README.md`** - This file

## 🚀 Quick Start

### Option 1: Automatic Import (Easiest)

**Double-click** one of these files:
- `import_to_xampp.bat` (Windows Command Prompt)
- `import_to_xampp.ps1` (PowerShell)

The script will:
1. Find your XAMPP MySQL installation
2. Import the database automatically
3. Show success/error messages

### Option 2: phpMyAdmin (Recommended)

1. Start XAMPP Control Panel
2. Start **MySQL** service
3. Click **Admin** button next to MySQL
4. In phpMyAdmin, click **SQL** tab
5. Click **Choose File** and select `create_database.sql`
6. Click **Go**

### Option 3: Manual Command Line

```bash
# Navigate to XAMPP MySQL bin directory
cd C:\xampp\mysql\bin

# Import the database
mysql -u root -p < C:\path\to\database\create_database.sql
```

## 📊 What Gets Created

### Database
- **Name**: `gestion_production`
- **Character Set**: UTF-8 (utf8mb4)

### Tables (5 total)

1. **machine** - Production machines
   - Fields: id, nom, etat, maintenance_prochaine
   - Sample data: 5 machines

2. **technicien** - Maintenance technicians
   - Fields: id, nom, competences, machine_assignee
   - Sample data: 5 technicians

3. **produit** - Products and components
   - Fields: id, nom, type, stock, fournisseur
   - Sample data: 5 products

4. **maintenance** - Maintenance records
   - Fields: id, machine, technicien, date, type
   - Sample data: 5 maintenance records

5. **ordre_fabrication** - Production orders
   - Fields: id, produit, quantite, date, machine, statut
   - Sample data: 5 production orders

## ✅ Verification

After import, verify in phpMyAdmin:

1. Database `gestion_production` appears in left sidebar
2. Click on it to see 5 tables
3. Click on each table → **Browse** to see sample data

Or use SQL:
```sql
USE gestion_production;
SHOW TABLES;
SELECT COUNT(*) FROM machine;        -- Should return 5
SELECT COUNT(*) FROM technicien;     -- Should return 5
SELECT COUNT(*) FROM produit;        -- Should return 5
SELECT COUNT(*) FROM maintenance;    -- Should return 5
SELECT COUNT(*) FROM ordre_fabrication; -- Should return 5
```

## 🔧 Backend Configuration

Make sure your `backend/src/main/resources/application.properties` has:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_production?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

**Note**: Leave password empty if you haven't set one in XAMPP.

## 🆘 Troubleshooting

### MySQL not found
- Make sure XAMPP is installed
- Check if MySQL is in: `C:\xampp\mysql\bin\`

### Access denied
- Check your MySQL root password
- Update `application.properties` with correct password

### Database already exists
- The script will drop and recreate it
- Or manually drop: `DROP DATABASE gestion_production;`

### Import fails
- Make sure MySQL service is running in XAMPP
- Try phpMyAdmin method instead
- Check XAMPP error logs

## 📚 Documentation

For detailed instructions, see:
- **`XAMPP_IMPORT_GUIDE.md`** - Complete step-by-step guide with screenshots descriptions

## 🎯 Next Steps

After successful import:

1. ✅ Database created with sample data
2. ✅ Start your Spring Boot backend
3. ✅ Access Swagger UI: http://localhost:8080/swagger-ui.html
4. ✅ Test the API endpoints
5. ✅ Start the Angular frontend

---

**Need help?** Check `XAMPP_IMPORT_GUIDE.md` for detailed instructions.
