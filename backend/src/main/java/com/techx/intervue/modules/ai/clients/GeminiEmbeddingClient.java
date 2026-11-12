package com.techx.intervue.modules.ai.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.techx.intervue.config.AiProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.EmbeddingInputType;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Component
public class GeminiEmbeddingClient implements EmbeddingClient {

    private static final String API_KEY_HEADER = "x-goog-api-key";
    private static final int MAX_INPUTS = 100;

    private final RestClient restClient;
    private final AiProperties.Gemini gemini;
    private final AiProperties.Embedding config;
    private final RetryTemplate retryTemplate;

    public GeminiEmbeddingClient(
            @Qualifier("geminiRestClient") RestClient restClient, AiProperties properties) {
        this.restClient = restClient;
        this.gemini = properties.gemini();
        this.config = properties.embedding();
        this.retryTemplate = AiProviderErrors.retryTemplate(gemini.maxRetries());
    }

    @Override
    public String model() {
        return config.model();
    }

    @Override
    public EmbeddingResult embed(EmbeddingRequest request) {
        AiProviderErrors.requireApiKey(gemini.apiKey());
        if (request.inputs().isEmpty() || request.inputs().size() > MAX_INPUTS) {
            throw new IllegalArgumentException(
                    "Embedding inputs must contain between 1 and " + MAX_INPUTS + " items");
        }
        return toResult(send(request), request.inputs().size());
    }

    private BatchResponse send(EmbeddingRequest request) {
        String modelPath = "models/" + config.model();
        String taskType =
                request.inputType() == EmbeddingInputType.QUERY
                        ? "RETRIEVAL_QUERY"
                        : "RETRIEVAL_DOCUMENT";
        BatchRequest body =
                new BatchRequest(
                        request.inputs().stream()
                                .map(
                                        text ->
                                                new EmbedRequest(
                                                        modelPath,
                                                        new Content(List.of(new Part(text))),
                                                        taskType,
                                                        config.dimensions()))
                                .toList());
        try {
            return retryTemplate.invoke(
                    () ->
                            restClient
                                    .post()
                                    .uri("/models/{model}:batchEmbedContents", config.model())
                                    .header(API_KEY_HEADER, gemini.apiKey())
                                    .body(body)
                                    .retrieve()
                                    .body(BatchResponse.class));
        } catch (RestClientResponseException ex) {
            log.warn("Gemini embedding answered with status {}", ex.getStatusCode().value());
            throw AiProviderErrors.fromStatus(ex.getStatusCode().value());
        } catch (ResourceAccessException ex) {
            log.warn("Gemini embedding could not be reached: {}", ex.getClass().getSimpleName());
            throw AiProviderErrors.fromIoFailure(ex);
        }
    }

    private EmbeddingResult toResult(BatchResponse response, int expectedCount) {
        if (response == null
                || response.embeddings() == null
                || response.embeddings().size() != expectedCount) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        List<float[]> vectors =
                response.embeddings().stream()
                        .map(
                                item -> {
                                    if (item.values() == null || item.values().isEmpty()) {
                                        throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
                                    }
                                    return toArray(item.values());
                                })
                        .toList();
        return new EmbeddingResult(vectors, new AiUsage(0, 0), config.model());
    }

    private float[] toArray(List<Float> values) {
        float[] array = new float[values.size()];
        for (int i = 0; i < array.length; i++) {
            array[i] = values.get(i);
        }
        return array;
    }

    private record BatchRequest(List<EmbedRequest> requests) {}

    private record EmbedRequest(
            String model, Content content, String taskType, int outputDimensionality) {}

    private record Content(List<Part> parts) {}

    private record Part(String text) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record BatchResponse(List<EmbeddingValues> embeddings) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record EmbeddingValues(List<Float> values) {}
}
