package org.cours.SpringDataRest.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
public class Voiture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "La marque est obligatoire")
    private String marque;

    @NotBlank(message = "Le modèle est obligatoire")
    private String modele;

    @NotBlank(message = "La couleur est obligatoire")
    private String couleur;

    @NotBlank(message = "L'immatricule est obligatoire")
    private String immatricule;

    @Min(value = 1900, message = "L'année doit être >= 1900")
    @Max(value = 2100, message = "L'année doit être <= 2100")
    private int annee;

    @Min(value = 0, message = "Le prix doit être positif")
    private int prix;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire")
    @JsonIgnore
    private Proprietaire proprietaire;

    public Voiture(String marque, String modele, String couleur,
                   String immatricule, int annee, int prix, Proprietaire proprietaire) {
        this.marque = marque;
        this.modele = modele;
        this.couleur = couleur;
        this.immatricule = immatricule;
        this.annee = annee;
        this.prix = prix;
        this.proprietaire = proprietaire;
    }
}
