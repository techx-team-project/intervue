package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.clients.EmbeddingClient;
import com.techx.intervue.modules.ai.entities.AiFaq;
import com.techx.intervue.modules.ai.repositories.AiFaqRepository;
import com.techx.intervue.modules.ai.requests.EmbeddingInputType;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;
import com.techx.intervue.modules.ai.resources.UserChatResponse;
import com.techx.intervue.modules.ai.services.interfaces.AiFaqServiceInterface;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiFaqService implements AiFaqServiceInterface {

    private final AiFaqRepository repository;
    private final EmbeddingClient embeddingClient;
    private final ObjectMapper objectMapper;

    private final List<CachedFaq> memoryCache = new CopyOnWriteArrayList<>();

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            reloadCache();
        } catch (Exception ex) {
            log.warn("FAQ cache initialization deferred: {}", ex.getMessage());
        }
    }

    @Override
    public Optional<UserChatResponse> findByCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        String cleanCode = code.trim().toLowerCase(Locale.ROOT);
        return memoryCache.stream()
                .filter(faq -> faq.code().equalsIgnoreCase(cleanCode))
                .findFirst()
                .or(() -> repository.findByCodeAndActiveTrue(cleanCode).map(this::toCachedFaq))
                .map(
                        faq ->
                                new UserChatResponse(
                                        faq.answer(),
                                        List.of("Hệ thống FAQ InterVue - " + faq.question())));
    }

    @Override
    public Optional<UserChatResponse> findSemanticMatch(String query, double minThreshold) {
        if (query == null || query.isBlank() || memoryCache.isEmpty()) {
            return Optional.empty();
        }

        try {
            EmbeddingResult result =
                    embeddingClient.embed(
                            new EmbeddingRequest(List.of(query.trim()), EmbeddingInputType.QUERY));
            if (result.vectors().isEmpty()) {
                return Optional.empty();
            }
            float[] queryVector = result.vectors().getFirst();

            return memoryCache.stream()
                    .filter(faq -> faq.vector() != null)
                    .map(faq -> new ScoredFaq(faq, cosineSimilarity(queryVector, faq.vector())))
                    .filter(scored -> scored.score() >= minThreshold)
                    .max(Comparator.comparingDouble(ScoredFaq::score))
                    .map(
                            scored ->
                                    new UserChatResponse(
                                            scored.faq().answer(),
                                            List.of(
                                                    "Hệ thống FAQ InterVue - "
                                                            + scored.faq().question())));
        } catch (Exception ex) {
            log.warn("Semantic FAQ match failed, falling back to RAG: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public void reloadCache() {
        List<AiFaq> activeFaqs = repository.findByActiveTrueOrderByDisplayOrderAsc();
        if (activeFaqs.isEmpty()) {
            memoryCache.clear();
            return;
        }

        List<AiFaq> needEmbedding = new ArrayList<>();
        List<CachedFaq> loaded = new ArrayList<>();

        for (AiFaq faq : activeFaqs) {
            float[] vector = deserializeVector(faq.getEmbedding());
            if (vector == null || vector.length == 0) {
                needEmbedding.add(faq);
            } else {
                loaded.add(
                        new CachedFaq(faq.getCode(), faq.getQuestion(), faq.getAnswer(), vector));
            }
        }

        if (!needEmbedding.isEmpty()) {
            try {
                List<String> questions = needEmbedding.stream().map(AiFaq::getQuestion).toList();
                EmbeddingResult result =
                        embeddingClient.embed(
                                new EmbeddingRequest(questions, EmbeddingInputType.DOCUMENT));
                List<float[]> vectors = result.vectors();

                for (int i = 0; i < needEmbedding.size(); i++) {
                    AiFaq faq = needEmbedding.get(i);
                    float[] vector = vectors.get(i);
                    faq.setEmbedding(serializeVector(vector));
                    repository.save(faq);
                    loaded.add(
                            new CachedFaq(
                                    faq.getCode(), faq.getQuestion(), faq.getAnswer(), vector));
                }
            } catch (Exception ex) {
                log.warn(
                        "Could not generate embeddings for some FAQs on startup: {}",
                        ex.getMessage());
                for (AiFaq faq : needEmbedding) {
                    loaded.add(
                            new CachedFaq(faq.getCode(), faq.getQuestion(), faq.getAnswer(), null));
                }
            }
        }

        memoryCache.clear();
        memoryCache.addAll(loaded);
        log.info("Loaded {} FAQs into in-memory cache", memoryCache.size());
    }

    private CachedFaq toCachedFaq(AiFaq faq) {
        return new CachedFaq(
                faq.getCode(),
                faq.getQuestion(),
                faq.getAnswer(),
                deserializeVector(faq.getEmbedding()));
    }

    private double cosineSimilarity(float[] a, float[] b) {
        if (a == null || b == null || a.length != b.length || a.length == 0) {
            return 0.0;
        }
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA <= 0.0 || normB <= 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private String serializeVector(float[] vector) {
        try {
            return objectMapper.writeValueAsString(vector);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to serialize embedding vector to JSON", ex);
        }
    }

    private float[] deserializeVector(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, float[].class);
        } catch (JsonProcessingException ex) {
            log.error("Failed to deserialize embedding vector from database", ex);
            return null;
        }
    }

    private record CachedFaq(String code, String question, String answer, float[] vector) {}

    private record ScoredFaq(CachedFaq faq, double score) {}
}
