package com.gestion.production_backend.service;

import com.gestion.production_backend.entity.Produit;
import com.gestion.production_backend.exception.ResourceNotFoundException;
import com.gestion.production_backend.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository repository;

    public List<Produit> findAll() {
        return repository.findAll();
    }

    public Produit findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produit not found"));
    }

    public Produit save(Produit entity) {
        return repository.save(entity);
    }

    public Produit update(Long id, Produit entity) {
        Produit existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Produit not found");
        }
        repository.deleteById(id);
    }

}