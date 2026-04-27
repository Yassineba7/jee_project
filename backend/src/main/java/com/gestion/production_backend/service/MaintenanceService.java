package com.gestion.production_backend.service;

import com.gestion.production_backend.entity.Maintenance;
import com.gestion.production_backend.exception.ResourceNotFoundException;
import com.gestion.production_backend.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository repository;

    public List<Maintenance> findAll() {
        return repository.findAll();
    }

    public Maintenance findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Maintenance not found"));
    }

    public Maintenance save(Maintenance entity) {
        return repository.save(entity);
    }

    public Maintenance update(Long id, Maintenance entity) {
        Maintenance existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Maintenance not found");
        }
        repository.deleteById(id);
    }

}