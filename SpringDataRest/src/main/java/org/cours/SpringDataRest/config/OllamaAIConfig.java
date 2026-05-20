package org.cours.SpringDataRest.config;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaAIConfig {

    @Value("${spring.ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${spring.ai.ollama.chat.model:llama2}")
    private String ollamaModel;

    @Bean
    public OllamaChatModel ollamaChatModel() {
        OllamaApi ollamaApi = new OllamaApi(ollamaBaseUrl);
        return OllamaChatModel.builder()
                .ollamaApi(ollamaApi)
                .defaultOptions(OllamaOptions.builder()
                        .model(ollamaModel)
                        .temperature(0.7)
                        .build())
                .build();
    }
}
