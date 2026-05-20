package org.cours.SpringDataRest.repository;

import org.cours.SpringDataRest.modele.Voiture;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface VoitureRepo extends CrudRepository<Voiture, Long> {

    List<Voiture> findByModele(@Param("modele") String modele);

    List<Voiture> findByCouleur(@Param("couleur") String couleur);
}
