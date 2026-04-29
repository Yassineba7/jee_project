# ============================================================================
# Automatic Database Import Script for XAMPP MySQL (PowerShell)
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Gestion Production - Database Import" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check common XAMPP installation paths
$mysqlPaths = @(
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\Program Files\xampp\mysql\bin\mysql.exe",
    "C:\Program Files (x86)\xampp\mysql\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlExe = $path
        break
    }
}

if (-not $mysqlExe) {
    Write-Host "[ERROR] XAMPP MySQL not found in common locations!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure XAMPP is installed and MySQL is running."
    Write-Host ""
    Write-Host "Common locations checked:"
    Write-Host "  - C:\xampp\mysql\bin\"
    Write-Host "  - C:\Program Files\xampp\mysql\bin\"
    Write-Host "  - C:\Program Files (x86)\xampp\mysql\bin\"
    Write-Host ""
    Write-Host "If XAMPP is installed elsewhere, please run manually:"
    Write-Host "  1. Open XAMPP Control Panel"
    Write-Host "  2. Start MySQL"
    Write-Host "  3. Open phpMyAdmin (http://localhost/phpmyadmin)"
    Write-Host "  4. Import the file: database\create_database.sql"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Found MySQL at: $mysqlExe" -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlFile = Join-Path $scriptDir "create_database.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "[ERROR] SQL file not found: $sqlFile" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] SQL file found: $sqlFile" -ForegroundColor Green
Write-Host ""

# Prompt for MySQL password
$password = Read-Host "Enter MySQL root password (press Enter if no password)" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

Write-Host ""
Write-Host "[INFO] Importing database..." -ForegroundColor Yellow
Write-Host ""

# Import the database
try {
    if ([string]::IsNullOrEmpty($passwordPlain)) {
        # No password
        Get-Content $sqlFile | & $mysqlExe -u root 2>&1 | Out-Null
    } else {
        # With password
        Get-Content $sqlFile | & $mysqlExe -u root "-p$passwordPlain" 2>&1 | Out-Null
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " SUCCESS! Database imported" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Database: gestion_production"
        Write-Host "Tables created:"
        Write-Host "  - machine (5 records)"
        Write-Host "  - technicien (5 records)"
        Write-Host "  - produit (5 records)"
        Write-Host "  - maintenance (5 records)"
        Write-Host "  - ordre_fabrication (5 records)"
        Write-Host ""
        Write-Host "You can now:"
        Write-Host "  1. Start your Spring Boot backend"
        Write-Host "  2. Access phpMyAdmin: http://localhost/phpmyadmin"
        Write-Host "  3. View Swagger UI: http://localhost:8080/swagger-ui.html"
        Write-Host ""
    } else {
        throw "MySQL returned error code: $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host " ERROR! Import failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:"
    Write-Host "  - MySQL is not running (start it in XAMPP Control Panel)"
    Write-Host "  - Wrong password"
    Write-Host "  - Insufficient permissions"
    Write-Host ""
    Write-Host "Try importing manually via phpMyAdmin:"
    Write-Host "  1. Go to http://localhost/phpmyadmin"
    Write-Host "  2. Click SQL tab"
    Write-Host "  3. Import file: database\create_database.sql"
    Write-Host ""
}

Read-Host "Press Enter to exit"
