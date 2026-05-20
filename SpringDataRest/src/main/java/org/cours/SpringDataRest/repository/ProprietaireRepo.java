package org.cours.SpringDataRest.repository;

import org.cours.SpringDataRest.modele.Proprietaire;
import org.springframework.data.repository.CrudRepository;

public interface ProprietaireRepo extends CrudRepository<Proprietaire, Long> {
}
