package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.clients.EmbeddingClient;
import com.techx.intervue.modules.ai.entities.AiKnowledgeChunk;
import com.techx.intervue.modules.ai.repositories.AiKnowledgeChunkRepository;
import com.techx.intervue.modules.ai.requests.EmbeddingInputType;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;
import com.techx.intervue.modules.ai.resources.KnowledgeChunk;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeBaseService implements KnowledgeBaseServiceInterface {

    private static final int BATCH_SIZE = 50;

    private final AiKnowledgeChunkRepository repository;
    private final EmbeddingClient embeddingClient;
    private final KnowledgeChunker chunker;
    private final ObjectMapper objectMapper;

    private final List<InMemoryChunk> memoryCache = new CopyOnWriteArrayList<>();

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            if (repository.count() == 0) {
                log.info("Knowledge base is empty. Indexing documents from resources...");
                indexAll(false);
            } else {
                reloadIntoMemory();
            }
        } catch (Exception ex) {
            log.warn("Knowledge base indexing skipped or deferred on startup: {}", ex.getMessage());
        }
    }

    @Override
    @Transactional
    public int indexAll(boolean forceReindex) {
        if (!forceReindex && repository.count() > 0) {
            reloadIntoMemory();
            return memoryCache.size();
        }

        List<KnowledgeChunk> chunks = chunker.loadAndChunkAll();
        if (chunks.isEmpty()) {
            log.warn("No knowledge chunks found to index");
            return 0;
        }

        log.info("Generating embeddings for {} knowledge chunks in batches...", chunks.size());
        List<AiKnowledgeChunk> entities = new ArrayList<>();

        for (int i = 0; i < chunks.size(); i += BATCH_SIZE) {
            int end = Math.min(i + BATCH_SIZE, chunks.size());
            List<KnowledgeChunk> batch = chunks.subList(i, end);
            List<String> texts = batch.stream().map(KnowledgeChunk::content).toList();

            EmbeddingResult result =
                    embeddingClient.embed(new EmbeddingRequest(texts, EmbeddingInputType.DOCUMENT));
            List<float[]> vectors = result.vectors();

            for (int j = 0; j < batch.size(); j++) {
                KnowledgeChunk chunk = batch.get(j);
                float[] vector = vectors.get(j);
                String embeddingJson = serializeVector(vector);

                entities.add(
                        AiKnowledgeChunk.builder()
                                .documentName(chunk.documentName())
                                .heading(chunk.heading())
                                .content(chunk.content())
                                .tokenCount(chunk.tokenCount())
                                .embedding(embeddingJson)
                                .build());
            }
        }

        if (forceReindex) {
            repository.deleteAllInBatch();
        }
        repository.saveAll(entities);
        reloadIntoMemory();
        log.info("Successfully indexed {} knowledge chunks into memory", memoryCache.size());
        return memoryCache.size();
    }

    @Override
    public List<KnowledgeMatch> retrieve(String query, int topK, double minScore) {
        if (query == null || query.isBlank() || topK <= 0) {
            return List.of();
        }
        if (memoryCache.isEmpty()) {
            reloadIntoMemory();
            if (memoryCache.isEmpty()) {
                return List.of();
            }
        }

        EmbeddingResult result =
                embeddingClient.embed(
                        new EmbeddingRequest(List.of(query), EmbeddingInputType.QUERY));
        if (result.vectors().isEmpty()) {
            return List.of();
        }
        float[] queryVector = result.vectors().getFirst();

        return memoryCache.stream()
                .map(chunk -> new ScoredChunk(chunk, cosineSimilarity(queryVector, chunk.vector())))
                .filter(sc -> sc.score() >= minScore)
                .sorted(Comparator.comparingDouble(ScoredChunk::score).reversed())
                .limit(topK)
                .map(
                        sc ->
                                new KnowledgeMatch(
                                        sc.chunk().documentName(),
                                        sc.chunk().heading(),
                                        sc.chunk().content(),
                                        sc.score()))
                .toList();
    }

    @Override
    public void reloadIntoMemory() {
        List<AiKnowledgeChunk> entities = repository.findAll();
        List<InMemoryChunk> loaded = new ArrayList<>(entities.size());
        for (AiKnowledgeChunk entity : entities) {
            float[] vector = deserializeVector(entity.getEmbedding());
            if (vector != null) {
                loaded.add(
                        new InMemoryChunk(
                                entity.getId(),
                                entity.getDocumentName(),
                                entity.getHeading(),
                                entity.getContent(),
                                vector));
            }
        }
        memoryCache.clear();
        memoryCache.addAll(loaded);
        log.info("Loaded {} knowledge chunks into in-memory cache", memoryCache.size());
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
        try {
            return objectMapper.readValue(json, float[].class);
        } catch (JsonProcessingException ex) {
            log.error("Failed to deserialize embedding vector from database", ex);
            return null;
        }
    }

    private record InMemoryChunk(
            Long id, String documentName, String heading, String content, float[] vector) {}

    private record ScoredChunk(InMemoryChunk chunk, double score) {}
}
