package org.cours.SpringDataRest.controller;

import org.cours.SpringDataRest.modele.Voiture;
import org.cours.SpringDataRest.repository.VoitureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/voitures")
public class VoitureController {

    @Autowired
    private VoitureRepo voitureRepo;

    @GetMapping
    public Iterable<Voiture> getVoitures() {
        return voitureRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voiture> getById(@PathVariable Long id) {
        return voitureRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        voitureRepo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Voiture update(@PathVariable Long id, @Valid @RequestBody Voiture v) {
        v.setId(id);
        return voitureRepo.save(v);
    }


}
