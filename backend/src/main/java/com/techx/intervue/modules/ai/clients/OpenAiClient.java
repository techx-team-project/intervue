package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "openai")
public class OpenAiClient implements AiClient {

    private final RestClient restClient;
    private final AiProperties.OpenAi config;
    private final OpenAiMessageMapper mapper;
    private final RetryTemplate retryTemplate;

    public OpenAiClient(
            @Qualifier("openAiRestClient") RestClient restClient,
            AiProperties properties,
            OpenAiMessageMapper mapper) {
        this.restClient = restClient;
        this.config = properties.openai();
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
        AiProviderErrors.requireConfigured(config.model());
        OpenAiMessageMapper.OpenAiRequest body =
                mapper.toRequest(request, config.model(), config.maxTokens());
        return mapper.toResult(send(body), config.model());
    }

    private OpenAiMessageMapper.OpenAiResponse send(OpenAiMessageMapper.OpenAiRequest body) {
        try {
            return retryTemplate.invoke(
                    () ->
                            restClient
                                    .post()
                                    .uri("/chat/completions")
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.apiKey())
                                    .body(body)
                                    .retrieve()
                                    .body(OpenAiMessageMapper.OpenAiResponse.class));
        } catch (RestClientResponseException ex) {
            log.warn("OpenAI answered with status {}", ex.getStatusCode().value());
            throw AiProviderErrors.fromStatus(ex.getStatusCode().value());
        } catch (ResourceAccessException ex) {
            log.warn("OpenAI could not be reached: {}", ex.getClass().getSimpleName());
            throw AiProviderErrors.fromIoFailure(ex);
        }
    }
}
