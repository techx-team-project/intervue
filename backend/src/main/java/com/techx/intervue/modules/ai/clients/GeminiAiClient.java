package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "gemini", matchIfMissing = true)
public class GeminiAiClient implements AiClient {

    private static final String API_KEY_HEADER = "x-goog-api-key";

    private final RestClient restClient;
    private final AiProperties.Gemini config;
    private final GeminiMessageMapper mapper;
    private final RetryTemplate retryTemplate;

    public GeminiAiClient(
            @Qualifier("geminiRestClient") RestClient restClient,
            AiProperties properties,
            GeminiMessageMapper mapper) {
        this.restClient = restClient;
        this.config = properties.gemini();
        this.mapper = mapper;
        this.retryTemplate = AiProviderErrors.retryTemplate(config.maxRetries());
    }

    @Override
    public String model() {
        return config.model();
    }

    @Override
    public AiChatResult chat(AiChatRequest request) {
        AiProviderErrors.requireApiKey(config.apiKey());
        GeminiMessageMapper.GeminiRequest body = mapper.toRequest(request, config);
        GeminiMessageMapper.GeminiResponse response = send(body);
        return mapper.toResult(response, config.model());
    }

    private GeminiMessageMapper.GeminiResponse send(GeminiMessageMapper.GeminiRequest body) {
        String modelName =
                config.model().startsWith("models/") ? config.model().substring(7) : config.model();
        try {
            return retryTemplate.invoke(
                    () ->
                            restClient
                                    .post()
                                    .uri("/models/{model}:generateContent", modelName)
                                    .header(API_KEY_HEADER, config.apiKey())
                                    .body(body)
                                    .retrieve()
                                    .body(GeminiMessageMapper.GeminiResponse.class));
        } catch (RestClientResponseException ex) {
            log.warn("Gemini answered with status {}", ex.getStatusCode().value());
            throw AiProviderErrors.fromStatus(ex.getStatusCode().value());
        } catch (ResourceAccessException ex) {
            log.warn("Gemini could not be reached: {}", ex.getClass().getSimpleName());
            throw AiProviderErrors.fromIoFailure(ex);
        }
    }
}
