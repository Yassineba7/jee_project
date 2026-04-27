package com.gestion.production_backend.repository;

import com.gestion.production_backend.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
}