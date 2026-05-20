package org.cours.SpringDataRest.controller;

import org.cours.SpringDataRest.modele.Voiture;
import org.cours.SpringDataRest.repository.VoitureRepo;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private OllamaChatModel chatModel;

    @Autowired
    private VoitureRepo voitureRepo;

    @PostMapping("/suggest")
    public ResponseEntity<Map<String, Object>> suggest(@RequestBody Map<String, Object> request) {
        int budget = ((Number) request.get("budget")).intValue();
        String preferences = (String) request.get("preferences");

        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>)
                request.getOrDefault("messages", new ArrayList<>());

        // 1. Pré-filtrer les voitures par budget
        List<Voiture> voituresFiltrees = StreamSupport
                .stream(voitureRepo.findAll().spliterator(), false)
                .filter(v -> v.getPrix() <= budget)
                .collect(Collectors.toList());

        // 2. Construire la liste des voitures pour le prompt
        String carsList = voituresFiltrees.isEmpty()
                ? "Aucune voiture disponible dans ce budget."
                : voituresFiltrees.stream()
                        .map(v -> String.format("- %s %s, couleur: %s, année: %d, prix: %d DH",
                                v.getMarque(), v.getModele(), v.getCouleur(), v.getAnnee(), v.getPrix()))
                        .collect(Collectors.joining("\n"));

        // 3. Construire l'historique de conversation
        String historyText = history.stream()
                .map(m -> (m.get("role").equals("user") ? "Client" : "Conseiller") + ": " + m.get("content"))
                .collect(Collectors.joining("\n"));

        // 4. Prompt structuré en français
        StringBuilder prompt = new StringBuilder();
        prompt.append("Tu es un conseiller automobile expert. Réponds UNIQUEMENT en français.\n\n");
        prompt.append("Voitures disponibles dans le budget de ").append(budget).append(" DH :\n");
        prompt.append(carsList).append("\n\n");

        if (!historyText.isEmpty()) {
            prompt.append("Historique de la conversation :\n").append(historyText).append("\n\n");
        }

        prompt.append("Nouvelle question du client (budget: ").append(budget)
              .append(" DH) : ").append(preferences).append("\n\n");
        prompt.append("Réponds obligatoirement en français avec cette structure :\n");
        prompt.append("1. Introduction courte (1-2 phrases)\n");
        prompt.append("2. Pour chaque voiture recommandée : nom, prix, et pourquoi elle correspond\n");
        prompt.append("3. Un conseil final\n");
        prompt.append("Sois concis, professionnel et bienveillant.");

        String response = chatModel.call(new Prompt(prompt.toString()))
                .getResult().getOutput().getText();

        Map<String, Object> result = new HashMap<>();
        result.put("response", response);
        result.put("voituresSuggerees", voituresFiltrees);
        return ResponseEntity.ok(result);
    }
}
