@echo off
REM ============================================================================
REM Automatic Database Import Script for XAMPP MySQL
REM ============================================================================

echo.
echo ========================================
echo  Gestion Production - Database Import
echo ========================================
echo.

REM Check common XAMPP installation paths
set MYSQL_PATH=
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_PATH=C:\xampp\mysql\bin
if exist "C:\Program Files\xampp\mysql\bin\mysql.exe" set MYSQL_PATH=C:\Program Files\xampp\mysql\bin
if exist "C:\Program Files (x86)\xampp\mysql\bin\mysql.exe" set MYSQL_PATH=C:\Program Files (x86)\xampp\mysql\bin

if "%MYSQL_PATH%"=="" (
    echo [ERROR] XAMPP MySQL not found in common locations!
    echo.
    echo Please make sure XAMPP is installed and MySQL is running.
    echo.
    echo Common locations checked:
    echo   - C:\xampp\mysql\bin\
    echo   - C:\Program Files\xampp\mysql\bin\
    echo   - C:\Program Files (x86)\xampp\mysql\bin\
    echo.
    echo If XAMPP is installed elsewhere, please run manually:
    echo   1. Open XAMPP Control Panel
    echo   2. Start MySQL
    echo   3. Open phpMyAdmin (http://localhost/phpmyadmin)
    echo   4. Import the file: database\create_database.sql
    echo.
    pause
    exit /b 1
)

echo [INFO] Found MySQL at: %MYSQL_PATH%
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
set SQL_FILE=%SCRIPT_DIR%create_database.sql

if not exist "%SQL_FILE%" (
    echo [ERROR] SQL file not found: %SQL_FILE%
    echo.
    pause
    exit /b 1
)

echo [INFO] SQL file found: %SQL_FILE%
echo.

REM Prompt for MySQL password
echo Enter MySQL root password (press Enter if no password):
set /p MYSQL_PASSWORD=

echo.
echo [INFO] Importing database...
echo.

if "%MYSQL_PASSWORD%"=="" (
    REM No password
    "%MYSQL_PATH%\mysql.exe" -u root < "%SQL_FILE%"
) else (
    REM With password
    "%MYSQL_PATH%\mysql.exe" -u root -p%MYSQL_PASSWORD% < "%SQL_FILE%"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Database imported
    echo ========================================
    echo.
    echo Database: gestion_production
    echo Tables created:
    echo   - machine (5 records)
    echo   - technicien (5 records)
    echo   - produit (5 records)
    echo   - maintenance (5 records)
    echo   - ordre_fabrication (5 records)
    echo.
    echo You can now:
    echo   1. Start your Spring Boot backend
    echo   2. Access phpMyAdmin: http://localhost/phpmyadmin
    echo   3. View Swagger UI: http://localhost:8080/swagger-ui.html
    echo.
) else (
    echo.
    echo ========================================
    echo  ERROR! Import failed
    echo ========================================
    echo.
    echo Possible reasons:
    echo   - MySQL is not running (start it in XAMPP Control Panel)
    echo   - Wrong password
    echo   - Insufficient permissions
    echo.
    echo Try importing manually via phpMyAdmin:
    echo   1. Go to http://localhost/phpmyadmin
    echo   2. Click SQL tab
    echo   3. Import file: database\create_database.sql
    echo.
)

pause
