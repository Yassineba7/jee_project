package com.gestion.production_backend.controller;

import com.gestion.production_backend.entity.OrdreFabrication;
import com.gestion.production_backend.service.OrdreFabricationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordres-fabrication")
@CrossOrigin(origins = "http://localhost:4200")
public class OrdreFabricationController {

    @Autowired
    private OrdreFabricationService service;

    @GetMapping
    public ResponseEntity<List<OrdreFabrication>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdreFabrication> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrdreFabrication> save(@Valid @RequestBody OrdreFabrication entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdreFabrication> update(@PathVariable Long id, @Valid @RequestBody OrdreFabrication entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}