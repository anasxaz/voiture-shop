package org.cours.SpringDataRest.repository;

import org.cours.SpringDataRest.modele.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
