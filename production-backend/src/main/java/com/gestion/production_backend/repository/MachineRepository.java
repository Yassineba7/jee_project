package com.gestion.production_backend.repository;

import com.gestion.production_backend.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Long> {
}