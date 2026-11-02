package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.clients.EmbeddingClient;
import com.techx.intervue.modules.ai.entities.AiKnowledgeChunk;
import com.techx.intervue.modules.ai.repositories.AiKnowledgeChunkRepository;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;
import com.techx.intervue.modules.ai.resources.KnowledgeChunk;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.services.impl.KnowledgeBaseService;
import com.techx.intervue.modules.ai.services.impl.KnowledgeChunker;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class KnowledgeBaseServiceTest {

    @Mock private AiKnowledgeChunkRepository repository;

    @Mock private EmbeddingClient embeddingClient;

    private KnowledgeChunker chunker;
    private ObjectMapper objectMapper;
    private KnowledgeBaseService service;

    @BeforeEach
    void setUp() {
        chunker = new KnowledgeChunker();
        objectMapper = new ObjectMapper();
        service = new KnowledgeBaseService(repository, embeddingClient, chunker, objectMapper);
    }

    @Test
    @DisplayName("Should load and chunk core platform documents")
    void shouldLoadAndChunkAllGuideDocuments() {
        List<KnowledgeChunk> chunks = chunker.loadAndChunkAll();

        assertThat(chunks).isNotEmpty();
        assertThat(chunks.stream().map(KnowledgeChunk::documentName).distinct())
                .contains("cv.md", "account_security.md", "faq.md");

        boolean has2fa =
                chunks.stream()
                        .anyMatch(
                                c ->
                                        c.documentName().equals("account_security.md")
                                                && c.heading()
                                                        .contains("Two-Factor Authentication"));
        assertThat(has2fa).isTrue();
    }

    @Test
    @DisplayName("'How do I enable 2FA?' finds the right chunk")
    void shouldFindRightChunkForSecurityTopic() {
        float[] securityVector = new float[] {0.9f, 0.1f, 0.0f};
        float[] otherVector = new float[] {0.0f, 0.1f, 0.9f};

        AiKnowledgeChunk chunk1 =
                AiKnowledgeChunk.builder()
                        .id(1L)
                        .documentName("account_security.md")
                        .heading("Two-Factor Authentication (2FA)")
                        .content(
                                "To protect your account, InterVue supports two-factor authentication...")
                        .tokenCount(250)
                        .embedding("[0.9, 0.1, 0.0]")
                        .build();

        AiKnowledgeChunk chunk2 =
                AiKnowledgeChunk.builder()
                        .id(2L)
                        .documentName("faq.md")
                        .heading("General FAQ")
                        .content("Other topic...")
                        .tokenCount(150)
                        .embedding("[0.0, 0.1, 0.9]")
                        .build();

        when(repository.findAll()).thenReturn(List.of(chunk1, chunk2));
        service.reloadIntoMemory();

        float[] queryVector = new float[] {0.88f, 0.12f, 0.02f};
        when(embeddingClient.embed(any(EmbeddingRequest.class)))
                .thenReturn(
                        new EmbeddingResult(List.of(queryVector), new AiUsage(10, 0), "voyage-4"));

        List<KnowledgeMatch> matches = service.retrieve("How do I enable 2FA?", 3, 0.65);

        assertThat(matches).isNotEmpty();
        assertThat(matches.getFirst().documentName()).isEqualTo("account_security.md");
        assertThat(matches.getFirst().heading()).isEqualTo("Two-Factor Authentication (2FA)");
        assertThat(matches.getFirst().score()).isGreaterThan(0.9);
    }

    @Test
    @DisplayName("An unrelated question finds nothing")
    void shouldFindNothingForUnrelatedQuestion() {
        AiKnowledgeChunk chunk =
                AiKnowledgeChunk.builder()
                        .id(1L)
                        .documentName("account_security.md")
                        .heading("Two-Factor Authentication (2FA)")
                        .content(
                                "To protect your account, InterVue supports two-factor authentication...")
                        .tokenCount(250)
                        .embedding("[0.9, 0.1, 0.0]")
                        .build();

        when(repository.findAll()).thenReturn(List.of(chunk));
        service.reloadIntoMemory();

        float[] unrelatedQueryVector = new float[] {0.0f, 0.0f, 1.0f};
        when(embeddingClient.embed(any(EmbeddingRequest.class)))
                .thenReturn(
                        new EmbeddingResult(
                                List.of(unrelatedQueryVector), new AiUsage(10, 0), "voyage-4"));

        List<KnowledgeMatch> matches =
                service.retrieve("What is the recipe for chocolate cake?", 3, 0.65);

        assertThat(matches).isEmpty();
    }
}
