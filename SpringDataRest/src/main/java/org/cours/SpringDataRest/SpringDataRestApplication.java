package org.cours.SpringDataRest;

import org.cours.SpringDataRest.modele.Proprietaire;
import org.cours.SpringDataRest.modele.User;
import org.cours.SpringDataRest.modele.Voiture;
import org.cours.SpringDataRest.repository.ProprietaireRepo;
import org.cours.SpringDataRest.repository.UserRepository;
import org.cours.SpringDataRest.repository.VoitureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SpringDataRestApplication {

	@Autowired
	private VoitureRepo repository;

	@Autowired
	private ProprietaireRepo proprietaireRepo;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(SpringDataRestApplication.class, args);
	}

	@Bean
	CommandLineRunner runner() {
		return args -> {
			if (userRepository.count() == 0) {
				Proprietaire p1 = new Proprietaire("Ali", "Hassan");
				Proprietaire p2 = new Proprietaire("Najat", "Bani");
				proprietaireRepo.save(p1);
				proprietaireRepo.save(p2);

				repository.save(new Voiture("Toyota", "Corolla", "Grise", "A-1-9090", 2018, 95000, p1));
				repository.save(new Voiture("Ford", "Fiesta", "Rouge", "A-2-8090", 2015, 90000, p1));
				repository.save(new Voiture("Honda", "CRV", "Bleu", "A-3-7090", 2016, 140000, p2));

				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole("ROLE_ADMIN");
				userRepository.save(admin);

				User user = new User();
				user.setUsername("user");
				user.setPassword(passwordEncoder.encode("user123"));
				user.setRole("ROLE_USER");
				userRepository.save(user);
			}
		};
	}
}
