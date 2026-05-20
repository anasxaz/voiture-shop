package org.cours.SpringDataRest.modele;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class DemandeContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;
    private long voitureId;
    private String marqueVoiture;
    private String modeleVoiture;

    @Column(length = 500)
    private String message;

    private LocalDateTime dateCreation = LocalDateTime.now();
    private boolean traitee = false;
}
