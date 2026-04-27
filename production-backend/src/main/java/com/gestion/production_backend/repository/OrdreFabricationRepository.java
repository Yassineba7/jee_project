package com.gestion.production_backend.repository;

import com.gestion.production_backend.entity.OrdreFabrication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdreFabricationRepository extends JpaRepository<OrdreFabrication, Long> {
}