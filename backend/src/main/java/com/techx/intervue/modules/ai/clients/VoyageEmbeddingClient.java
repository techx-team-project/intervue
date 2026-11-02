package com.techx.intervue.modules.ai.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.config.AiProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Component
public class VoyageEmbeddingClient implements EmbeddingClient {

    private static final int MAX_INPUTS = 1000;
    private static final Duration RETRY_DELAY = Duration.ofMillis(500);

    private final RestClient restClient;
    private final AiProperties.Voyage config;
    private final RetryTemplate retryTemplate;

    public VoyageEmbeddingClient(
            @Qualifier("voyageRestClient") RestClient restClient, AiProperties properties) {
        this.restClient = restClient;
        this.config = properties.voyage();
        this.retryTemplate =
                new RetryTemplate(
                        RetryPolicy.builder()
                                .maxRetries(config.maxRetries())
                                .delay(RETRY_DELAY)
                                .multiplier(2)
                                .predicate(VoyageEmbeddingClient::isTransient)
                                .build());
    }

    @Override
    public String model() {
        return config.model();
    }

    @Override
    public EmbeddingResult embed(EmbeddingRequest request) {
        AiProviderErrors.requireApiKey(config.apiKey());
        if (request.inputs().isEmpty() || request.inputs().size() > MAX_INPUTS) {
            throw new IllegalArgumentException(
                    "Embedding inputs must contain between 1 and " + MAX_INPUTS + " items");
        }
        return toResult(send(request), request.inputs().size());
    }

    private VoyageResponse send(EmbeddingRequest request) {
        VoyageRequest body =
                new VoyageRequest(
                        request.inputs(),
                        config.model(),
                        request.inputType().name().toLowerCase(Locale.ROOT));
        try {
            return retryTemplate.invoke(
                    () ->
                            restClient
                                    .post()
                                    .uri("/embeddings")
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.apiKey())
                                    .body(body)
                                    .retrieve()
                                    .body(VoyageResponse.class));
        } catch (RestClientResponseException ex) {
            log.warn("Voyage AI answered with status {}", ex.getStatusCode().value());
            throw AiProviderErrors.fromStatus(ex.getStatusCode().value());
        } catch (ResourceAccessException ex) {
            log.warn("Voyage AI could not be reached: {}", ex.getClass().getSimpleName());
            throw AiProviderErrors.fromIoFailure(ex);
        }
    }

    private EmbeddingResult toResult(VoyageResponse response, int expectedCount) {
        if (response == null
                || response.data() == null
                || response.data().size() != expectedCount) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        float[][] vectors = new float[expectedCount][];
        for (VoyageEmbedding item : response.data()) {
            if (item.index() < 0 || item.index() >= expectedCount || item.embedding() == null) {
                throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
            }
            vectors[item.index()] = toArray(item.embedding());
        }
        int totalTokens = response.usage() == null ? 0 : response.usage().totalTokens();
        return new EmbeddingResult(List.of(vectors), new AiUsage(totalTokens, 0), config.model());
    }

    private float[] toArray(List<Float> values) {
        float[] array = new float[values.size()];
        for (int i = 0; i < array.length; i++) {
            array[i] = values.get(i);
        }
        return array;
    }

    private static boolean isTransient(Throwable failure) {
        if (failure instanceof RestClientResponseException ex) {
            return AiProviderErrors.isRetryableStatus(ex.getStatusCode().value());
        }
        return failure instanceof ResourceAccessException;
    }

    private record VoyageRequest(
            List<String> input, String model, @JsonProperty("input_type") String inputType) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VoyageResponse(List<VoyageEmbedding> data, VoyageUsage usage) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VoyageEmbedding(List<Float> embedding, int index) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VoyageUsage(@JsonProperty("total_tokens") int totalTokens) {}
}
