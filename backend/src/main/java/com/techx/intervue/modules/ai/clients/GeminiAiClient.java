package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Component
public class GeminiAiClient implements AiClient {

    private static final String API_KEY_HEADER = "x-goog-api-key";
    private static final Duration RETRY_DELAY = Duration.ofMillis(500);

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
        this.retryTemplate =
                new RetryTemplate(
                        RetryPolicy.builder()
                                .maxRetries(config.maxRetries())
                                .delay(RETRY_DELAY)
                                .multiplier(2)
                                .predicate(GeminiAiClient::isTransient)
                                .build());
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

    private static boolean isTransient(Throwable failure) {
        if (failure instanceof RestClientResponseException ex) {
            return AiProviderErrors.isRetryableStatus(ex.getStatusCode().value());
        }
        return failure instanceof ResourceAccessException;
    }
}
