package com.gestion.production_backend.controller;

import com.gestion.production_backend.entity.Technicien;
import com.gestion.production_backend.service.TechnicienService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/techniciens")
@CrossOrigin(origins = "http://localhost:4200")
public class TechnicienController {

    @Autowired
    private TechnicienService service;

    @GetMapping
    public ResponseEntity<List<Technicien>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Technicien> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Technicien> save(@Valid @RequestBody Technicien entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Technicien> update(@PathVariable Long id, @Valid @RequestBody Technicien entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}