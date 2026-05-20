package org.cours.SpringDataRest.controller;

import org.cours.SpringDataRest.modele.DemandeContact;
import org.cours.SpringDataRest.repository.DemandeContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/contacts")
public class DemandeContactController {

    @Autowired
    private DemandeContactRepository demandeContactRepository;

    @PostMapping
    public ResponseEntity<DemandeContact> creer(@RequestBody DemandeContact demande, Principal principal) {
        demande.setUsername(principal.getName());
        demande.setDateCreation(LocalDateTime.now());
        demande.setTraitee(false);
        return ResponseEntity.ok(demandeContactRepository.save(demande));
    }

    @GetMapping
    public Iterable<DemandeContact> getAll() {
        return demandeContactRepository.findAll();
    }

    @PutMapping("/{id}/traiter")
    public ResponseEntity<DemandeContact> traiter(@PathVariable Long id) {
        return demandeContactRepository.findById(id).map(d -> {
            d.setTraitee(true);
            return ResponseEntity.ok(demandeContactRepository.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        demandeContactRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
