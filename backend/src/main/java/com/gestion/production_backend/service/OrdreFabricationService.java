package com.gestion.production_backend.service;

import com.gestion.production_backend.entity.OrdreFabrication;
import com.gestion.production_backend.exception.ResourceNotFoundException;
import com.gestion.production_backend.repository.OrdreFabricationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdreFabricationService {

    @Autowired
    private OrdreFabricationRepository repository;

    public List<OrdreFabrication> findAll() {
        return repository.findAll();
    }

    public OrdreFabrication findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("OrdreFabrication not found"));
    }

    public OrdreFabrication save(OrdreFabrication entity) {
        return repository.save(entity);
    }

    public OrdreFabrication update(Long id, OrdreFabrication entity) {
        OrdreFabrication existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("OrdreFabrication not found");
        }
        repository.deleteById(id);
    }

}