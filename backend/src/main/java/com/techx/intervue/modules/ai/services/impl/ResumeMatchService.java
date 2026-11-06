package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.resources.RequirementEvidenceMatch;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeMatchService implements ResumeMatchServiceInterface {

    public static final String FEATURE_NAME = "resume-match";
    public static final String PROMPT_NAME = "resume-match";
    public static final int PROMPT_VERSION = 1;
    public static final String PROMPT_VERSION_TAG = "resume-match.v1";
    public static final String DISCLAIMER =
            "InterVue AI only assists with evidence-based evaluation. AI never accepts, rejects, or ranks candidates. Missing information is not missing skill. Final hiring decisions belong entirely to the recruiter.";

    private final AiGatewayServiceInterface aiGatewayService;
    private final PromptServiceInterface promptService;
    private final CandidatePrivacySanitizerInterface privacySanitizer;
    private final ObjectMapper objectMapper;

    @Override
    @Async("aiTaskExecutor")
    public CompletableFuture<ResumeMatchResult> analyzeAsync(
            Long recruiterUserId, String ip, ResumeMatchRequest request) {
        return CompletableFuture.completedFuture(analyze(recruiterUserId, ip, request));
    }

    @Override
    public ResumeMatchResult analyze(Long recruiterUserId, String ip, ResumeMatchRequest request) {
        if (request == null
                || request.jobRequirements() == null
                || request.jobRequirements().isEmpty()) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        String sanitizedCandidateData =
                privacySanitizer.sanitizeCandidateData(request.candidateData(), request.cvText());
        privacySanitizer.validateNoSensitiveDataSent(sanitizedCandidateData);

        String userMessage = buildUserPrompt(request, sanitizedCandidateData);
        PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);

        AiCallContext context = new AiCallContext(FEATURE_NAME, recruiterUserId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(
                        systemPrompt, List.of(AiChatMessage.user(userMessage)), List.of());

        AiChatResult result = aiGatewayService.chat(context, chatRequest);
        ParsedMatchPayload parsed = parseModelResponse(result.text(), request.jobRequirements());

        return new ResumeMatchResult(
                request.applicationId(),
                parsed.experienceSummary(),
                parsed.requirements(),
                parsed.questionsToAsk(),
                result.model() != null ? result.model() : "gemini-2.5-flash",
                PROMPT_VERSION_TAG,
                true,
                Instant.now(),
                DISCLAIMER);
    }

    private String buildUserPrompt(ResumeMatchRequest request, String sanitizedCandidateData) {
        StringBuilder sb = new StringBuilder();
        sb.append("<job_context>\n");
        sb.append("Job Title: ").append(request.jobTitle()).append("\n");
        if (request.jobDescription() != null && !request.jobDescription().isBlank()) {
            sb.append("Job Description: ").append(request.jobDescription().trim()).append("\n");
        }
        sb.append("Job Requirements to Evaluate:\n");
        for (int i = 0; i < request.jobRequirements().size(); i++) {
            sb.append(i + 1)
                    .append(". ")
                    .append(request.jobRequirements().get(i).trim())
                    .append("\n");
        }
        sb.append("</job_context>\n\n");

        sb.append("<candidate_data>\n");
        sb.append(sanitizedCandidateData).append("\n");
        sb.append("</candidate_data>\n\n");

        sb.append(
                "Please evaluate the evidence in the candidate data for each requirement and output JSON.");
        return sb.toString();
    }

    private ParsedMatchPayload parseModelResponse(
            String rawText, List<String> originalRequirements) {
        String json = extractJson(rawText);
        String summary = "Kinh nghiệm ứng viên phù hợp với các yêu cầu kỹ thuật chính.";
        Map<String, RequirementEvidenceMatch> matchedMap = new HashMap<>();
        List<String> questions = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(json);
            if (root.has("experienceSummary")
                    && !root.get("experienceSummary").asText().isBlank()) {
                summary = root.get("experienceSummary").asText().trim();
            }

            if (root.has("requirements") && root.get("requirements").isArray()) {
                for (JsonNode reqNode : root.get("requirements")) {
                    String reqText = reqNode.path("requirement").asText("");
                    boolean hasEv = reqNode.path("hasEvidence").asBoolean(false);
                    String ev = reqNode.path("evidence").asText("");

                    if (!hasEv
                            || ev.isBlank()
                            || ev.equalsIgnoreCase("no evidence yet")
                            || ev.toLowerCase().contains("chưa có bằng chứng")) {
                        matchedMap.put(
                                normalizeKey(reqText),
                                RequirementEvidenceMatch.withoutEvidence(reqText));
                    } else {
                        matchedMap.put(
                                normalizeKey(reqText),
                                RequirementEvidenceMatch.withEvidence(reqText, ev.trim()));
                    }
                }
            }

            if (root.has("questionsToAsk") && root.get("questionsToAsk").isArray()) {
                for (JsonNode qNode : root.get("questionsToAsk")) {
                    String q = qNode.asText("");
                    if (!q.isBlank()) {
                        questions.add(q.trim());
                    }
                }
            }
        } catch (JsonProcessingException ex) {
            log.warn(
                    "Failed to parse AI JSON response for resume match: {}. Falling back to default extraction.",
                    ex.getMessage());
        }

        List<RequirementEvidenceMatch> finalList = new ArrayList<>();
        for (String req : originalRequirements) {
            String norm = normalizeKey(req);
            RequirementEvidenceMatch match = matchedMap.get(norm);
            if (match != null) {
                finalList.add(
                        new RequirementEvidenceMatch(
                                req,
                                match.hasEvidence(),
                                match.evidence(),
                                match.clarificationNote()));
            } else {
                finalList.add(RequirementEvidenceMatch.withoutEvidence(req));
            }
        }

        if (questions.isEmpty()) {
            questions.add(
                    "Bạn có thể chia sẻ thêm về các dự án thực tế liên quan đến yêu cầu công việc?");
            questions.add(
                    "Thử thách kỹ thuật lớn nhất bạn từng giải quyết với công nghệ này là gì?");
        }

        return new ParsedMatchPayload(summary, finalList, questions);
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text.trim();
    }

    private String normalizeKey(String key) {
        if (key == null) return "";
        return key.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    private record ParsedMatchPayload(
            String experienceSummary,
            List<RequirementEvidenceMatch> requirements,
            List<String> questionsToAsk) {}
}
