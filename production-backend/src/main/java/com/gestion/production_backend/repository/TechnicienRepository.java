package com.gestion.production_backend.repository;

import com.gestion.production_backend.entity.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicienRepository extends JpaRepository<Technicien, Long> {
}