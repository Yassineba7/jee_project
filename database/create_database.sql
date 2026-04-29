-- ============================================================================
-- Database Creation Script for Gestion Production
-- ============================================================================
-- This script will:
-- 1. Drop and recreate the database
-- 2. Create all tables
-- 3. Insert sample data
-- ============================================================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS gestion_production;
CREATE DATABASE gestion_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_production;

-- ============================================================================
-- TABLE: machine
-- ============================================================================
CREATE TABLE machine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    etat VARCHAR(255) NOT NULL,
    maintenance_prochaine DATE,
    CONSTRAINT chk_machine_etat CHECK (etat IN ('Opérationnelle', 'En panne', 'En maintenance', 'Hors service'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: technicien
-- ============================================================================
CREATE TABLE technicien (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    competences TEXT,
    machine_assignee VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: produit
-- ============================================================================
CREATE TABLE produit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    fournisseur VARCHAR(255),
    CONSTRAINT chk_produit_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: maintenance
-- ============================================================================
CREATE TABLE maintenance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    machine VARCHAR(255) NOT NULL,
    technicien VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(255) NOT NULL,
    CONSTRAINT chk_maintenance_type CHECK (type IN ('Préventive', 'Corrective', 'Prédictive'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: ordre_fabrication
-- ============================================================================
CREATE TABLE ordre_fabrication (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    produit VARCHAR(255) NOT NULL,
    quantite INT NOT NULL,
    date DATE NOT NULL,
    machine VARCHAR(255) NOT NULL,
    statut VARCHAR(255) NOT NULL,
    CONSTRAINT chk_ordre_quantite CHECK (quantite > 0),
    CONSTRAINT chk_ordre_statut CHECK (statut IN ('En attente', 'En cours', 'Terminé', 'Annulé'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA: machines
-- ============================================================================
INSERT INTO machine (nom, etat, maintenance_prochaine) VALUES
('Machine A - Découpe', 'Opérationnelle', '2026-05-15'),
('Machine B - Assemblage', 'Opérationnelle', '2026-05-20'),
('Machine C - Peinture', 'En maintenance', '2026-05-01'),
('Machine D - Emballage', 'Opérationnelle', '2026-06-10'),
('Machine E - Contrôle qualité', 'En panne', '2026-04-30');

-- ============================================================================
-- SAMPLE DATA: techniciens
-- ============================================================================
INSERT INTO technicien (nom, competences, machine_assignee) VALUES
('Ahmed Benali', 'Mécanique, Électronique', 'Machine A - Découpe'),
('Fatima Zahra', 'Hydraulique, Pneumatique', 'Machine B - Assemblage'),
('Mohamed Alami', 'Électricité, Automatisme', 'Machine C - Peinture'),
('Khadija Idrissi', 'Informatique industrielle', 'Machine D - Emballage'),
('Youssef Tazi', 'Maintenance préventive', 'Machine E - Contrôle qualité');

-- ============================================================================
-- SAMPLE DATA: produits
-- ============================================================================
INSERT INTO produit (nom, type, stock, fournisseur) VALUES
('Pièce métallique A', 'Composant', 150, 'Fournisseur Metal Pro'),
('Pièce plastique B', 'Composant', 200, 'Fournisseur Plastic Inc'),
('Assemblage complet C', 'Produit fini', 50, 'Production interne'),
('Peinture industrielle', 'Consommable', 80, 'Fournisseur ChemColor'),
('Emballage carton', 'Consommable', 300, 'Fournisseur PackBox');

-- ============================================================================
-- SAMPLE DATA: maintenances
-- ============================================================================
INSERT INTO maintenance (machine, technicien, date, type) VALUES
('Machine A - Découpe', 'Ahmed Benali', '2026-04-15', 'Préventive'),
('Machine B - Assemblage', 'Fatima Zahra', '2026-04-18', 'Préventive'),
('Machine C - Peinture', 'Mohamed Alami', '2026-04-25', 'Corrective'),
('Machine D - Emballage', 'Khadija Idrissi', '2026-04-20', 'Préventive'),
('Machine E - Contrôle qualité', 'Youssef Tazi', '2026-04-28', 'Corrective');

-- ============================================================================
-- SAMPLE DATA: ordres de fabrication
-- ============================================================================
INSERT INTO ordre_fabrication (produit, quantite, date, machine, statut) VALUES
('Pièce métallique A', 100, '2026-04-28', 'Machine A - Découpe', 'En cours'),
('Pièce plastique B', 150, '2026-04-27', 'Machine B - Assemblage', 'Terminé'),
('Assemblage complet C', 50, '2026-04-29', 'Machine C - Peinture', 'En attente'),
('Pièce métallique A', 200, '2026-04-26', 'Machine A - Découpe', 'Terminé'),
('Assemblage complet C', 75, '2026-04-30', 'Machine D - Emballage', 'En attente');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Uncomment these to verify the data after import:

-- SELECT 'Machines' AS Table_Name, COUNT(*) AS Row_Count FROM machine
-- UNION ALL
-- SELECT 'Techniciens', COUNT(*) FROM technicien
-- UNION ALL
-- SELECT 'Produits', COUNT(*) FROM produit
-- UNION ALL
-- SELECT 'Maintenances', COUNT(*) FROM maintenance
-- UNION ALL
-- SELECT 'Ordres de fabrication', COUNT(*) FROM ordre_fabrication;

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
