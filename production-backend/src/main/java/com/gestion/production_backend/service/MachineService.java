package com.gestion.production_backend.service;

import com.gestion.production_backend.entity.Machine;
import com.gestion.production_backend.exception.ResourceNotFoundException;
import com.gestion.production_backend.repository.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MachineService {

    @Autowired
    private MachineRepository repository;

    public List<Machine> findAll() {
        return repository.findAll();
    }

    public Machine findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Machine not found"));
    }

    public Machine save(Machine entity) {
        return repository.save(entity);
    }

    public Machine update(Long id, Machine entity) {
        Machine existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Machine not found");
        }
        repository.deleteById(id);
    }

}