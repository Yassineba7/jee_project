package com.gestion.production_backend.service;

import com.gestion.production_backend.entity.Technicien;
import com.gestion.production_backend.exception.ResourceNotFoundException;
import com.gestion.production_backend.repository.TechnicienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TechnicienService {

    @Autowired
    private TechnicienRepository repository;

    public List<Technicien> findAll() {
        return repository.findAll();
    }

    public Technicien findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Technicien not found"));
    }

    public Technicien save(Technicien entity) {
        return repository.save(entity);
    }

    public Technicien update(Long id, Technicien entity) {
        Technicien existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Technicien not found");
        }
        repository.deleteById(id);
    }

}