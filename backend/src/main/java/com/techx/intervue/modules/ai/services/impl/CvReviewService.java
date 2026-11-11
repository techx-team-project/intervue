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
import com.techx.intervue.modules.ai.resources.JobRequirementMatch;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.credits.services.CandidateCreditServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.repositories.JobRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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
    public static final String FEATURE_LEVEL_3 = "cv-review-level-3";
    public static final String PROMPT_NAME = "cv-feedback";
    public static final int PROMPT_VERSION = 1;
    public static final String PROMPT_VERSION_TAG = "cv-feedback.v1";

    public static final String PROMPT_NAME_JOB_FIT = "cv-feedback-job-fit";
    public static final int PROMPT_VERSION_JOB_FIT = 1;
    public static final String PROMPT_VERSION_TAG_JOB_FIT = "cv-feedback-job-fit.v1";

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
    private final JobRepository jobRepository;
    private final CandidateCreditServiceInterface candidateCreditService;

    @Override
    @Transactional
    public CvReviewResult reviewCv(Long candidateUserId, String ip, CvReviewRequest request) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        CandidateProfile profile = candidateProfileLookup.require(candidateUserId);

        String rawText;
        String rawKey;

        if (request.resumeId() != null) {
            CandidateResume resume =
                    candidateResumeRepository
                            .findByIdAndCandidateProfileId(request.resumeId(), profile.getId())
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

            rawText =
                    resume.getParsedSummary() != null && !resume.getParsedSummary().isBlank()
                            ? resume.getParsedSummary()
                            : resume.getFileName();
            rawKey = rawText + ":" + resume.getFileSizeBytes();
        } else if (request.cvText() != null && !request.cvText().isBlank()) {
            rawText = cvTextCleaner.clean(request.cvText());
            rawKey = rawText;
        } else {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        if (request.jobId() != null || (request.level() != null && request.level() == 3)) {
            if (request.jobId() == null) {
                throw new AppException(ErrorCode.VALIDATION_FAILED);
            }
            Job job =
                    jobRepository
                            .findById(request.jobId())
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            String fileHash = calculateTextHash(rawKey + ":job:" + job.getId());
            return evaluateCvLevel3(profile, candidateUserId, ip, rawText, fileHash, job);
        }

        String fileHash = calculateTextHash(rawKey);
        return evaluateCv(
                profile, candidateUserId, ip, rawText, fileHash, request.targetPosition());
    }

    @Override
    @Transactional
    public CvReviewResult reviewUploadedPdf(
            Long candidateUserId,
            String ip,
            MultipartFile file,
            String targetPosition,
            Long jobId) {
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

        if (jobId != null) {
            Job job =
                    jobRepository
                            .findById(jobId)
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            String fileHash = calculateTextHash(extraction.fileHash() + ":job:" + job.getId());
            return evaluateCvLevel3(profile, candidateUserId, ip, rawText, fileHash, job);
        }

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
                            .reviewLevel(
                                    targetPosition != null && !targetPosition.isBlank() ? 2 : 1)
                            .targetPosition(position)
                            .fileHash(fileHash)
                            .overallScore(parsed.overallScore())
                            .summary(parsed.summary())
                            .commentsJson(commentsJson)
                            .modelVersion(aiResult.model())
                            .promptVersion(PROMPT_VERSION_TAG)
                            .chargedCredits(0)
                            .isRefunded(false)
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

    private CvReviewResult evaluateCvLevel3(
            CandidateProfile profile,
            Long candidateUserId,
            String ip,
            String rawText,
            String fileHash,
            Job job) {

        Optional<AiCvReview> cached =
                aiCvReviewRepository
                        .findFirstByCandidateProfileIdAndFileHashAndJobIdAndReviewLevelOrderByCreatedAtDesc(
                                profile.getId(), fileHash, job.getId(), 3);
        if (cached.isPresent()) {
            log.info(
                    "Unchanged CV detected for candidate {} and job {} (fileHash: {}). Reusing cached Level 3 review without charging.",
                    candidateUserId,
                    job.getId(),
                    fileHash);
            return toResult(cached.get(), true);
        }

        candidateCreditService.charge(
                profile,
                1,
                "CV_REVIEW_LEVEL_3",
                job.getId().toString(),
                "Đánh giá CV mức 3 (so khớp với tin tuyển dụng #"
                        + job.getId()
                        + " - "
                        + job.getTitle()
                        + ")");

        try {
            String sanitizedCv = privacySanitizer.sanitizeCandidateData(null, rawText);
            privacySanitizer.validateNoSensitiveDataSent(sanitizedCv);

            String skillsStr =
                    job.getSkills() != null
                            ? job.getSkills().stream()
                                    .map(Skill::getName)
                                    .collect(Collectors.joining(", "))
                            : "N/A";

            String userMessage =
                    """
                    Job Information:
                    - Job Title: %s
                    - Company Name: %s
                    - Career Level: %s
                    - Job Requirements:
                    %s
                    - Required Skills: %s
                    - Job Description:
                    %s

                    Candidate CV Content:
                    %s
                    """
                            .formatted(
                                    job.getTitle(),
                                    job.getCompanyName(),
                                    job.getLevel() != null
                                            ? job.getLevel().name()
                                            : "Not specified",
                                    job.getRequirements() != null ? job.getRequirements() : "N/A",
                                    skillsStr.isBlank() ? "N/A" : skillsStr,
                                    job.getDescription() != null ? job.getDescription() : "N/A",
                                    sanitizedCv);

            PromptTemplate systemPrompt =
                    promptService.load(PROMPT_NAME_JOB_FIT, PROMPT_VERSION_JOB_FIT);
            AiCallContext callContext =
                    new AiCallContext(FEATURE_LEVEL_3, candidateUserId, ip, true);
            AiChatRequest chatRequest =
                    new AiChatRequest(
                            systemPrompt, List.of(AiChatMessage.user(userMessage)), List.of());

            AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
            ParsedCvJobFitReview parsed = parseAiJobFitResponse(aiResult.text());

            String commentsJson = objectMapper.writeValueAsString(parsed.comments());

            JobFitBreakdown breakdown =
                    new JobFitBreakdown(
                            parsed.requirementMatches(),
                            parsed.keyStrengths(),
                            parsed.gapAnalysis(),
                            parsed.tailoringTips());
            String requirementMatchesJson = objectMapper.writeValueAsString(breakdown);

            AiCvReview entity =
                    AiCvReview.builder()
                            .candidateProfile(profile)
                            .job(job)
                            .reviewLevel(3)
                            .targetPosition(job.getTitle())
                            .fileHash(fileHash)
                            .overallScore(parsed.jobFitScore())
                            .jobFitScore(parsed.jobFitScore())
                            .summary(parsed.summary())
                            .commentsJson(commentsJson)
                            .requirementMatchesJson(requirementMatchesJson)
                            .modelVersion(aiResult.model())
                            .promptVersion(PROMPT_VERSION_TAG_JOB_FIT)
                            .chargedCredits(1)
                            .isRefunded(false)
                            .build();

            AiCvReview saved = aiCvReviewRepository.save(entity);
            return toResult(saved, false);

        } catch (AppException e) {
            log.warn(
                    "AppException during Level 3 CV review for candidate {}, automatically refunding 1 credit: {}",
                    candidateUserId,
                    e.getMessage());
            candidateCreditService.refund(
                    profile,
                    1,
                    "CV_REVIEW_LEVEL_3",
                    job.getId().toString(),
                    "Tự động hoàn 1 credit do lỗi AI khi đánh giá công việc #" + job.getId());
            throw e;
        } catch (Exception e) {
            log.error(
                    "Unexpected error during Level 3 CV review for candidate {}, automatically refunding 1 credit: {}",
                    candidateUserId,
                    e.getMessage(),
                    e);
            candidateCreditService.refund(
                    profile,
                    1,
                    "CV_REVIEW_LEVEL_3",
                    job.getId().toString(),
                    "Tự động hoàn 1 credit do sự cố xử lý AI khi đánh giá công việc #"
                            + job.getId());
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
        JobFitBreakdown breakdown = parseBreakdown(entity.getRequirementMatchesJson());

        String jobTitle =
                entity.getJob() != null
                        ? entity.getJob().getTitle()
                        : (entity.getTargetPosition() != null
                                ? entity.getTargetPosition()
                                : "General Review");

        String companyName = entity.getJob() != null ? entity.getJob().getCompanyName() : null;

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
                .reviewLevel(entity.getReviewLevel())
                .jobId(entity.getJob() != null ? entity.getJob().getId() : null)
                .jobTitle(jobTitle)
                .companyName(companyName)
                .jobFitScore(
                        entity.getJobFitScore() != null
                                ? entity.getJobFitScore()
                                : entity.getOverallScore())
                .requirementMatches(breakdown.requirementMatches())
                .keyStrengths(breakdown.keyStrengths())
                .gapAnalysis(breakdown.gapAnalysis())
                .tailoringTips(breakdown.tailoringTips())
                .chargedCredits(entity.getChargedCredits())
                .refunded(entity.isRefunded())
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

    private JobFitBreakdown parseBreakdown(String json) {
        if (json == null || json.isBlank()) {
            return new JobFitBreakdown(List.of(), List.of(), List.of(), List.of());
        }
        try {
            JsonNode root = objectMapper.readTree(json);
            List<JobRequirementMatch> matches = new ArrayList<>();
            List<String> strengths = new ArrayList<>();
            List<String> gaps = new ArrayList<>();
            List<String> tips = new ArrayList<>();

            JsonNode matchesArray =
                    root.isArray()
                            ? root
                            : (root.has("requirementMatches")
                                    ? root.path("requirementMatches")
                                    : null);
            if (matchesArray != null && matchesArray.isArray()) {
                for (JsonNode m : matchesArray) {
                    matches.add(
                            JobRequirementMatch.builder()
                                    .requirement(m.path("requirement").asText(""))
                                    .status(m.path("status").asText("PARTIAL").toUpperCase())
                                    .cvEvidence(m.path("cvEvidence").asText(""))
                                    .explanation(m.path("explanation").asText(""))
                                    .fitScore(m.path("fitScore").asInt(75))
                                    .improvementTip(m.path("improvementTip").asText(""))
                                    .build());
                }
            }

            if (!root.isArray()) {
                if (root.has("keyStrengths") && root.path("keyStrengths").isArray()) {
                    for (JsonNode s : root.path("keyStrengths")) {
                        strengths.add(s.asText());
                    }
                }
                if (root.has("gapAnalysis") && root.path("gapAnalysis").isArray()) {
                    for (JsonNode g : root.path("gapAnalysis")) {
                        gaps.add(g.asText());
                    }
                }
                if (root.has("tailoringTips") && root.path("tailoringTips").isArray()) {
                    for (JsonNode t : root.path("tailoringTips")) {
                        tips.add(t.asText());
                    }
                }
            }

            return new JobFitBreakdown(matches, strengths, gaps, tips);
        } catch (Exception e) {
            log.warn("Failed to deserialize requirement matches JSON: {}", e.getMessage());
            return new JobFitBreakdown(List.of(), List.of(), List.of(), List.of());
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

    private ParsedCvJobFitReview parseAiJobFitResponse(String rawResponse) {
        try {
            String jsonContent = extractJson(rawResponse);
            JsonNode root = objectMapper.readTree(jsonContent);

            int jobFitScore = root.path("jobFitScore").asInt(80);
            String summary = root.path("summary").asText("Đánh giá độ phù hợp với tin tuyển dụng.");

            List<JobRequirementMatch> matches = new ArrayList<>();
            JsonNode matchesArray = root.path("requirementMatches");
            if (matchesArray.isArray()) {
                for (JsonNode node : matchesArray) {
                    matches.add(
                            JobRequirementMatch.builder()
                                    .requirement(node.path("requirement").asText(""))
                                    .status(node.path("status").asText("PARTIAL").toUpperCase())
                                    .cvEvidence(node.path("cvEvidence").asText(""))
                                    .explanation(node.path("explanation").asText(""))
                                    .fitScore(node.path("fitScore").asInt(75))
                                    .improvementTip(node.path("improvementTip").asText(""))
                                    .build());
                }
            }

            List<String> keyStrengths = new ArrayList<>();
            JsonNode strengthsArray = root.path("keyStrengths");
            if (strengthsArray.isArray()) {
                for (JsonNode s : strengthsArray) {
                    keyStrengths.add(s.asText());
                }
            }

            List<String> gapAnalysis = new ArrayList<>();
            JsonNode gapsArray = root.path("gapAnalysis");
            if (gapsArray.isArray()) {
                for (JsonNode g : gapsArray) {
                    gapAnalysis.add(g.asText());
                }
            }

            List<String> tailoringTips = new ArrayList<>();
            JsonNode tipsArray = root.path("tailoringTips");
            if (tipsArray.isArray()) {
                for (JsonNode t : tipsArray) {
                    tailoringTips.add(t.asText());
                }
            }

            List<CvReviewComment> comments = new ArrayList<>();
            JsonNode commentsArray = root.path("comments");
            if (commentsArray.isArray()) {
                for (JsonNode node : commentsArray) {
                    comments.add(
                            CvReviewComment.builder()
                                    .section(node.path("section").asText("General"))
                                    .quote(node.path("quote").asText(""))
                                    .problem(node.path("problem").asText(""))
                                    .fix(node.path("fix").asText(""))
                                    .build());
                }
            }

            return new ParsedCvJobFitReview(
                    jobFitScore,
                    summary,
                    matches,
                    keyStrengths,
                    gapAnalysis,
                    tailoringTips,
                    comments);
        } catch (Exception e) {
            log.warn("Failed to parse AI job fit response: {}", e.getMessage());
            return new ParsedCvJobFitReview(
                    75,
                    "CV đã được so khớp với tin tuyển dụng.",
                    List.of(
                            JobRequirementMatch.builder()
                                    .requirement("Yêu cầu công việc tổng quan")
                                    .status("PARTIAL")
                                    .cvEvidence("Kinh nghiệm tổng quan trong CV")
                                    .explanation(
                                            "Hồ sơ đáp ứng một phần các yêu cầu chính của công việc.")
                                    .fitScore(75)
                                    .improvementTip(
                                            "Bổ sung thêm các từ khóa chuyên môn sát với tin tuyển dụng.")
                                    .build()),
                    List.of("Nền tảng kỹ thuật phù hợp với yêu cầu vị trí"),
                    List.of("Cần nêu rõ số năm kinh nghiệm và dự án thực tế"),
                    List.of("Tùy biến từ khóa trong CV khớp với tiêu chí tuyển dụng"),
                    List.of());
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

    private record ParsedCvJobFitReview(
            int jobFitScore,
            String summary,
            List<JobRequirementMatch> requirementMatches,
            List<String> keyStrengths,
            List<String> gapAnalysis,
            List<String> tailoringTips,
            List<CvReviewComment> comments) {}

    private record JobFitBreakdown(
            List<JobRequirementMatch> requirementMatches,
            List<String> keyStrengths,
            List<String> gapAnalysis,
            List<String> tailoringTips) {}
}
