package com.gestion.production_backend.controller;

import com.gestion.production_backend.entity.Machine;
import com.gestion.production_backend.service.MachineService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "http://localhost:4200")
public class MachineController {

    @Autowired
    private MachineService service;

    @GetMapping
    public ResponseEntity<List<Machine>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Machine> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Machine> save(@Valid @RequestBody Machine entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Machine> update(@PathVariable Long id, @Valid @RequestBody Machine entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}