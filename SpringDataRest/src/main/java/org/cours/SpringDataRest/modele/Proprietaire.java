package org.cours.SpringDataRest.modele;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class Proprietaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NonNull
    private String nom;

    @NonNull
    private String prenom;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "proprietaire")
    @JsonIgnore
    private List<Voiture> voitures;
}
