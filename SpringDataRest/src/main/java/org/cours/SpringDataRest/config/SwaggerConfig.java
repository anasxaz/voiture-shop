package org.cours.SpringDataRest.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Voiture Shop API")
                        .description("API REST pour la gestion du catalogue de voitures, authentification JWT et conseiller IA")
                        .version("1.0.0"));
    }
}
