package com.gestion.production_backend.controller;

import com.gestion.production_backend.entity.Maintenance;
import com.gestion.production_backend.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
@CrossOrigin(origins = "http://localhost:4200")
public class MaintenanceController {

    @Autowired
    private MaintenanceService service;

    @GetMapping
    public ResponseEntity<List<Maintenance>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Maintenance> save(@Valid @RequestBody Maintenance entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> update(@PathVariable Long id, @Valid @RequestBody Maintenance entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}