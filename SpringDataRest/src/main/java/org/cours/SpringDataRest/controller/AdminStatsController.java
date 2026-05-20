package org.cours.SpringDataRest.controller;

import org.cours.SpringDataRest.modele.Voiture;
import org.cours.SpringDataRest.repository.DemandeContactRepository;
import org.cours.SpringDataRest.repository.VoitureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/admin/stats")
public class AdminStatsController {

    @Autowired
    private VoitureRepo voitureRepo;

    @Autowired
    private DemandeContactRepository demandeContactRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Voiture> voitures = StreamSupport
                .stream(voitureRepo.findAll().spliterator(), false)
                .collect(Collectors.toList());

        long totalVoitures = voitures.size();

        long demandesEnAttente = StreamSupport
                .stream(demandeContactRepository.findAll().spliterator(), false)
                .filter(d -> !d.isTraitee())
                .count();

        long totalDemandes = StreamSupport
                .stream(demandeContactRepository.findAll().spliterator(), false)
                .count();

        Optional<Voiture> plusChere = voitures.stream()
                .max(Comparator.comparingInt(Voiture::getPrix));

        Optional<Voiture> moinsChere = voitures.stream()
                .min(Comparator.comparingInt(Voiture::getPrix));

        double prixMoyen = voitures.stream()
                .mapToInt(Voiture::getPrix)
                .average()
                .orElse(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVoitures", totalVoitures);
        stats.put("demandesEnAttente", demandesEnAttente);
        stats.put("totalDemandes", totalDemandes);
        stats.put("prixMoyen", (int) prixMoyen);
        stats.put("voiturePlusChere", plusChere.map(v ->
                v.getMarque() + " " + v.getModele() + " — " + v.getPrix() + " DH").orElse("-"));
        stats.put("voitureMoinsChere", moinsChere.map(v ->
                v.getMarque() + " " + v.getModele() + " — " + v.getPrix() + " DH").orElse("-"));

        return ResponseEntity.ok(stats);
    }
}
