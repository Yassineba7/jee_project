package com.gestion.production_backend.repository;

import com.gestion.production_backend.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
}