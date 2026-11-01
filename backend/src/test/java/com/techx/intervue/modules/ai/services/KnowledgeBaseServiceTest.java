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
    @DisplayName("Should load and chunk all 10 guide documents into 300-500 token chunks")
    void shouldLoadAndChunkAllGuideDocuments() {
        List<KnowledgeChunk> chunks = chunker.loadAndChunkAll();

        assertThat(chunks).isNotEmpty();
        assertThat(chunks.stream().map(KnowledgeChunk::documentName).distinct())
                .contains(
                        "register.md",
                        "profile.md",
                        "cv.md",
                        "search.md",
                        "apply.md",
                        "track.md",
                        "interviews.md",
                        "recruiter_flows.md",
                        "account_security.md",
                        "faq.md");

        boolean hasCompanyVerification =
                chunks.stream()
                        .anyMatch(
                                c ->
                                        c.documentName().equals("recruiter_flows.md")
                                                && c.heading().contains("Verify Your Company"));
        assertThat(hasCompanyVerification).isTrue();
    }

    @Test
    @DisplayName("'How do I verify my company?' finds the right chunk")
    void shouldFindRightChunkForCompanyVerification() {
        float[] verificationVector = new float[] {0.9f, 0.1f, 0.0f};
        float[] otherVector = new float[] {0.0f, 0.1f, 0.9f};

        AiKnowledgeChunk chunk1 =
                AiKnowledgeChunk.builder()
                        .id(1L)
                        .documentName("recruiter_flows.md")
                        .heading("How to Verify Your Company (Company Verification Process)")
                        .content("To maintain a safe, trusted IT hiring ecosystem...")
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

        List<KnowledgeMatch> matches = service.retrieve("How do I verify my company?", 3, 0.65);

        assertThat(matches).isNotEmpty();
        assertThat(matches.getFirst().documentName()).isEqualTo("recruiter_flows.md");
        assertThat(matches.getFirst().heading())
                .isEqualTo("How to Verify Your Company (Company Verification Process)");
        assertThat(matches.getFirst().score()).isGreaterThan(0.9);
    }

    @Test
    @DisplayName("An unrelated question finds nothing")
    void shouldFindNothingForUnrelatedQuestion() {
        AiKnowledgeChunk chunk =
                AiKnowledgeChunk.builder()
                        .id(1L)
                        .documentName("recruiter_flows.md")
                        .heading("How to Verify Your Company (Company Verification Process)")
                        .content("To maintain a safe, trusted IT hiring ecosystem...")
                        .tokenCount(250)
                        .embedding("[0.9, 0.1, 0.0]")
                        .build();

        when(repository.findAll()).thenReturn(List.of(chunk));
        service.reloadIntoMemory();

        // An unrelated query vector pointing in an orthogonal direction
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
