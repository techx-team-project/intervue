package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.entities.AiCvReview;
import com.techx.intervue.modules.ai.repositories.AiCvReviewRepository;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.CvReviewRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.CvReviewComment;
import com.techx.intervue.modules.ai.resources.CvReviewQuotaResource;
import com.techx.intervue.modules.ai.resources.CvReviewResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CvReviewService implements CvReviewServiceInterface {

    public static final String FEATURE_NAME = "cv-review";
    public static final String PROMPT_NAME = "cv-feedback";
    public static final int PROMPT_VERSION = 1;
    public static final String PROMPT_VERSION_TAG = "cv-feedback.v1";

    private final CandidateProfileLookup candidateProfileLookup;
    private final CandidateResumeRepository candidateResumeRepository;
    private final AiCvReviewRepository aiCvReviewRepository;
    private final CvReviewQuotaServiceInterface quotaService;
    private final CvTextExtractorServiceInterface cvTextExtractorService;
    private final CvTextCleaner cvTextCleaner;
    private final CandidatePrivacySanitizerInterface privacySanitizer;
    private final PromptServiceInterface promptService;
    private final AiGatewayServiceInterface aiGatewayService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public CvReviewResult reviewCv(Long candidateUserId, String ip, CvReviewRequest request) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        CandidateProfile profile = candidateProfileLookup.require(candidateUserId);

        String rawText = "";
        String fileHash;

        if (request.resumeId() != null) {
            CandidateResume resume =
                    candidateResumeRepository
                            .findByIdAndCandidateProfileId(request.resumeId(), profile.getId())
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

            rawText =
                    resume.getParsedSummary() != null && !resume.getParsedSummary().isBlank()
                            ? resume.getParsedSummary()
                            : resume.getFileName();
            fileHash = calculateTextHash(rawText + ":" + resume.getFileSizeBytes());
        } else if (request.cvText() != null && !request.cvText().isBlank()) {
            rawText = cvTextCleaner.clean(request.cvText());
            fileHash = calculateTextHash(rawText);
        } else {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        return evaluateCv(
                profile, candidateUserId, ip, rawText, fileHash, request.targetPosition());
    }

    @Override
    @Transactional
    public CvReviewResult reviewUploadedPdf(
            Long candidateUserId, String ip, MultipartFile file, String targetPosition) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }
        CandidateProfile profile = candidateProfileLookup.require(candidateUserId);

        CvTextExtractionResult extraction = cvTextExtractorService.extractText(file);
        if (!extraction.readable()) {
            log.warn(
                    "CV upload unreadable for user {}: {}",
                    candidateUserId,
                    extraction.unreadableReason());
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        String rawText = extraction.text();
        String fileHash = extraction.fileHash();

        return evaluateCv(profile, candidateUserId, ip, rawText, fileHash, targetPosition);
    }

    private CvReviewResult evaluateCv(
            CandidateProfile profile,
            Long candidateUserId,
            String ip,
            String rawText,
            String fileHash,
            String targetPosition) {

        Optional<AiCvReview> cached =
                aiCvReviewRepository.findFirstByCandidateProfileIdAndFileHashOrderByCreatedAtDesc(
                        profile.getId(), fileHash);
        if (cached.isPresent()) {
            log.info(
                    "Unchanged CV detected for candidate {} (fileHash: {}). Reusing existing review without using quota.",
                    candidateUserId,
                    fileHash);
            return toResult(cached.get(), true);
        }

        quotaService.checkAndConsumeQuota(candidateUserId);

        try {
            String sanitizedCv = privacySanitizer.sanitizeCandidateData(null, rawText);
            privacySanitizer.validateNoSensitiveDataSent(sanitizedCv);

            String position =
                    targetPosition != null && !targetPosition.isBlank()
                            ? targetPosition
                            : (profile.getHeadline() != null
                                    ? profile.getHeadline()
                                    : "Software Engineer");

            String userMessage =
                    """
                    Target Job Title: %s
                    Candidate CV Content:
                    %s
                    """
                            .formatted(position, sanitizedCv);

            PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);
            AiCallContext callContext = new AiCallContext(FEATURE_NAME, candidateUserId, ip, true);
            AiChatRequest chatRequest =
                    new AiChatRequest(
                            systemPrompt, List.of(AiChatMessage.user(userMessage)), List.of());

            AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
            ParsedCvReview parsed = parseAiResponse(aiResult.text());

            String commentsJson = objectMapper.writeValueAsString(parsed.comments());
            AiCvReview entity =
                    AiCvReview.builder()
                            .candidateProfile(profile)
                            .fileHash(fileHash)
                            .overallScore(parsed.overallScore())
                            .summary(parsed.summary())
                            .commentsJson(commentsJson)
                            .modelVersion(aiResult.model())
                            .promptVersion(PROMPT_VERSION_TAG)
                            .build();

            AiCvReview saved = aiCvReviewRepository.save(entity);
            return toResult(saved, false);

        } catch (AppException e) {
            quotaService.releaseQuota(candidateUserId);
            throw e;
        } catch (Exception e) {
            log.error(
                    "Failed to analyze CV for candidate {}: {}",
                    candidateUserId,
                    e.getMessage(),
                    e);
            quotaService.releaseQuota(candidateUserId);
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CvReviewResult getReviewById(Long candidateUserId, Long reviewId) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        AiCvReview review =
                aiCvReviewRepository
                        .findById(reviewId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (!review.getCandidateProfile().getUserId().equals(candidateUserId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        return toResult(review, false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CvReviewResult> getCandidateReviews(Long candidateUserId) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        CandidateProfile profile = candidateProfileLookup.require(candidateUserId);
        return aiCvReviewRepository
                .findByCandidateProfileIdOrderByCreatedAtDesc(profile.getId())
                .stream()
                .map(r -> toResult(r, false))
                .toList();
    }

    @Override
    public CvReviewQuotaResource getQuota(Long candidateUserId) {
        return quotaService.getQuota(candidateUserId);
    }

    private CvReviewResult toResult(AiCvReview entity, boolean fromCache) {
        List<CvReviewComment> comments = parseComments(entity.getCommentsJson());
        return CvReviewResult.builder()
                .id(entity.getId())
                .candidateProfileId(entity.getCandidateProfile().getId())
                .fileHash(entity.getFileHash())
                .overallScore(entity.getOverallScore())
                .summary(entity.getSummary())
                .comments(comments)
                .modelVersion(entity.getModelVersion())
                .promptVersion(entity.getPromptVersion())
                .fromCache(fromCache)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private List<CvReviewComment> parseComments(String commentsJson) {
        if (commentsJson == null || commentsJson.isBlank()) {
            return List.of();
        }
        try {
            JsonNode arrayNode = objectMapper.readTree(commentsJson);
            if (!arrayNode.isArray()) return List.of();
            List<CvReviewComment> list = new ArrayList<>();
            for (JsonNode item : arrayNode) {
                list.add(
                        CvReviewComment.builder()
                                .section(item.path("section").asText("General"))
                                .quote(item.path("quote").asText(""))
                                .problem(item.path("problem").asText(""))
                                .fix(item.path("fix").asText(""))
                                .build());
            }
            return list;
        } catch (JsonProcessingException e) {
            log.warn("Failed to deserialize comments JSON: {}", e.getMessage());
            return List.of();
        }
    }

    private ParsedCvReview parseAiResponse(String rawResponse) {
        try {
            String jsonContent = extractJson(rawResponse);
            JsonNode root = objectMapper.readTree(jsonContent);

            String summary = root.path("summary").asText("");
            Integer score = root.has("overallScore") ? root.path("overallScore").asInt() : 80;

            List<CvReviewComment> comments = new ArrayList<>();
            JsonNode commentsArray = root.path("comments");
            if (commentsArray.isArray()) {
                for (JsonNode node : commentsArray) {
                    String quote = node.path("quote").asText("").trim();
                    String problem = node.path("problem").asText("").trim();
                    String fix = node.path("fix").asText("").trim();
                    String section = node.path("section").asText("General").trim();

                    if (!quote.isBlank() && !problem.isBlank() && !fix.isBlank()) {
                        comments.add(
                                CvReviewComment.builder()
                                        .section(section)
                                        .quote(quote)
                                        .problem(problem)
                                        .fix(fix)
                                        .build());
                    }
                }
            }

            return new ParsedCvReview(summary, score, comments);
        } catch (Exception e) {
            log.warn(
                    "Could not parse AI JSON output directly: {}. Falling back to default comment.",
                    e.getMessage());
            List<CvReviewComment> fallback =
                    List.of(
                            CvReviewComment.builder()
                                    .section("General")
                                    .quote("Overall CV content")
                                    .problem(
                                            "CV descriptions could benefit from more quantifiable achievements")
                                    .fix(
                                            "Use the STAR method: Situation, Task, Action, Result with clear metrics")
                                    .build());
            return new ParsedCvReview("CV reviewed with recommendations.", 80, fallback);
        }
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }

    private String calculateTextHash(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    private record ParsedCvReview(
            String summary, Integer overallScore, List<CvReviewComment> comments) {}
}
