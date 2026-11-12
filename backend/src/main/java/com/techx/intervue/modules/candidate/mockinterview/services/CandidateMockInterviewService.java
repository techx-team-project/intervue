package com.techx.intervue.modules.candidate.mockinterview.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.mockinterview.entities.AiMockInterview;
import com.techx.intervue.modules.candidate.mockinterview.entities.AiMockInterviewQuestion;
import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewStatus;
import com.techx.intervue.modules.candidate.mockinterview.repositories.AiMockInterviewQuestionRepository;
import com.techx.intervue.modules.candidate.mockinterview.repositories.AiMockInterviewRepository;
import com.techx.intervue.modules.candidate.mockinterview.requests.StartMockInterviewRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockAnswerRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockFollowUpRequest;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewDetailResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewQuestionResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewSummaryResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.SubmitAnswerResultResource;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateMockInterviewService implements CandidateMockInterviewServiceInterface {

    private static final String FEATURE_INIT = "mock-interview-init";
    private static final String FEATURE_EVAL = "mock-interview-eval";
    private static final String FEATURE_SUMMARY = "mock-interview-summary";

    private static final String PROMPT_INIT_NAME = "mock-interview-init";
    private static final String PROMPT_EVAL_NAME = "mock-interview-evaluate";
    private static final String PROMPT_SUMMARY_NAME = "mock-interview-summary";
    private static final int PROMPT_VERSION = 1;

    private final AiMockInterviewRepository interviewRepository;
    private final AiMockInterviewQuestionRepository questionRepository;
    private final CandidateProfileRepository profileRepository;
    private final CandidateResumeRepository resumeRepository;
    private final CandidateResumeServiceInterface resumeService;
    private final CvTextExtractorServiceInterface cvTextExtractorService;
    private final CandidatePrivacySanitizerInterface privacySanitizer;
    private final AiGatewayServiceInterface aiGatewayService;
    private final PromptServiceInterface promptService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public MockInterviewDetailResource startSession(
            Long candidateId, StartMockInterviewRequest request, String ip) {
        Long resumeId = request.resumeId();
        String cvText = "";

        Optional<CandidateProfile> profileOpt = profileRepository.findByUserId(candidateId);

        if (resumeId != null) {
            CandidateProfile profile =
                    profileOpt.orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            CandidateResume resume =
                    resumeRepository
                            .findByIdAndCandidateProfileId(resumeId, profile.getId())
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            cvText = extractResumeText(resume.getId(), candidateId);
        } else if (profileOpt.isPresent()) {
            Optional<CandidateResume> defaultResume =
                    resumeRepository.findByCandidateProfileIdAndIsDefaultTrue(
                            profileOpt.get().getId());
            if (defaultResume.isPresent()) {
                resumeId = defaultResume.get().getId();
                cvText = extractResumeText(resumeId, candidateId);
            }
        }

        String sanitizedCv = privacySanitizer.sanitizeCandidateData(null, cvText);

        int questionCount =
                Math.clamp(request.questionCount() != null ? request.questionCount() : 5, 5, 10);

        String userPrompt =
                String.format(
                        "Target Role: %s\nSeniority Level: %s\nFocus Area: %s\nQuestion Count: %d\n\nCandidate Background (CV):\n%s",
                        request.targetRole(),
                        request.seniorityLevel(),
                        request.focusArea(),
                        questionCount,
                        sanitizedCv.isBlank()
                                ? "No CV uploaded. Ask based on target role."
                                : sanitizedCv);

        PromptTemplate systemPrompt = promptService.load(PROMPT_INIT_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_INIT, candidateId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(userPrompt)), List.of());

        AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
        List<GeneratedQuestion> generatedQuestions =
                parseGeneratedQuestions(aiResult.text(), questionCount);

        AiMockInterview interview =
                AiMockInterview.builder()
                        .candidateId(candidateId)
                        .resumeId(resumeId)
                        .targetRole(request.targetRole())
                        .seniorityLevel(request.seniorityLevel())
                        .focusArea(request.focusArea())
                        .questionCount(generatedQuestions.size())
                        .currentQuestionIndex(0)
                        .status(MockInterviewStatus.IN_PROGRESS)
                        .questions(new ArrayList<>())
                        .build();

        AiMockInterview savedInterview = interviewRepository.save(interview);

        for (GeneratedQuestion gq : generatedQuestions) {
            AiMockInterviewQuestion q =
                    AiMockInterviewQuestion.builder()
                            .mockInterview(savedInterview)
                            .questionOrder(gq.order())
                            .category(gq.category())
                            .questionText(gq.questionText())
                            .build();
            savedInterview.getQuestions().add(questionRepository.save(q));
        }

        return mapToDetail(savedInterview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MockInterviewSummaryResource> listHistory(Long candidateId) {
        return interviewRepository.findAllByCandidateIdOrderByCreatedAtDesc(candidateId).stream()
                .map(this::mapToSummary)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MockInterviewDetailResource getSessionDetail(Long candidateId, Long sessionId) {
        AiMockInterview interview =
                interviewRepository
                        .findByIdAndCandidateId(sessionId, candidateId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return mapToDetail(interview);
    }

    @Override
    @Transactional
    public SubmitAnswerResultResource submitAnswer(
            Long candidateId,
            Long sessionId,
            Long questionId,
            SubmitMockAnswerRequest request,
            String ip) {
        AiMockInterview interview =
                interviewRepository
                        .findByIdAndCandidateId(sessionId, candidateId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (interview.getStatus() != MockInterviewStatus.IN_PROGRESS) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        AiMockInterviewQuestion question =
                questionRepository
                        .findByIdAndMockInterviewId(questionId, sessionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        question.setCandidateAnswer(request.answer().trim());
        question.setAnsweredAt(Instant.now());

        String evalPrompt =
                String.format(
                        "Target Role: %s (%s)\nQuestion: %s\nCandidate Answer: %s\nIs this a follow-up answer: false",
                        interview.getTargetRole(),
                        interview.getSeniorityLevel(),
                        question.getQuestionText(),
                        question.getCandidateAnswer());

        PromptTemplate systemPrompt = promptService.load(PROMPT_EVAL_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_EVAL, candidateId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(evalPrompt)), List.of());

        AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
        AnswerEvaluation evaluation = parseAnswerEvaluation(aiResult.text());

        question.setScore(evaluation.score());
        question.setFeedback(evaluation.feedback());
        question.setIdealAnswer(evaluation.idealAnswer());

        boolean hasFollowUp = evaluation.needsFollowUp() && evaluation.followUpQuestion() != null;
        if (hasFollowUp) {
            question.setFollowUpQuestion(evaluation.followUpQuestion().trim());
            questionRepository.save(question);

            return SubmitAnswerResultResource.builder()
                    .questionId(question.getId())
                    .questionOrder(question.getQuestionOrder())
                    .needsFollowUp(true)
                    .followUpQuestion(question.getFollowUpQuestion())
                    .feedback(question.getFeedback())
                    .score(question.getScore())
                    .idealAnswer(question.getIdealAnswer())
                    .sessionCompleted(false)
                    .nextQuestion(null)
                    .completedSession(null)
                    .build();
        }

        questionRepository.save(question);
        return advanceToNextQuestionOrComplete(interview, question, candidateId, ip);
    }

    @Override
    @Transactional
    public SubmitAnswerResultResource submitFollowUp(
            Long candidateId,
            Long sessionId,
            Long questionId,
            SubmitMockFollowUpRequest request,
            String ip) {
        AiMockInterview interview =
                interviewRepository
                        .findByIdAndCandidateId(sessionId, candidateId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (interview.getStatus() != MockInterviewStatus.IN_PROGRESS) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        AiMockInterviewQuestion question =
                questionRepository
                        .findByIdAndMockInterviewId(questionId, sessionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (question.getFollowUpQuestion() == null || question.getFollowUpQuestion().isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        question.setFollowUpAnswer(request.followUpAnswer().trim());
        question.setFollowUpAnsweredAt(Instant.now());

        String evalPrompt =
                String.format(
                        "Target Role: %s (%s)\nQuestion: %s\nInitial Answer: %s\nFollow-up Question: %s\nFollow-up Answer: %s\nIs this a follow-up answer: true",
                        interview.getTargetRole(),
                        interview.getSeniorityLevel(),
                        question.getQuestionText(),
                        question.getCandidateAnswer(),
                        question.getFollowUpQuestion(),
                        question.getFollowUpAnswer());

        PromptTemplate systemPrompt = promptService.load(PROMPT_EVAL_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_EVAL, candidateId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(evalPrompt)), List.of());

        AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
        AnswerEvaluation evaluation = parseAnswerEvaluation(aiResult.text());

        question.setScore(evaluation.score());
        if (evaluation.feedback() != null && !evaluation.feedback().isBlank()) {
            question.setFeedback(evaluation.feedback());
        }
        if (evaluation.idealAnswer() != null && !evaluation.idealAnswer().isBlank()) {
            question.setIdealAnswer(evaluation.idealAnswer());
        }
        questionRepository.save(question);

        return advanceToNextQuestionOrComplete(interview, question, candidateId, ip);
    }

    private SubmitAnswerResultResource advanceToNextQuestionOrComplete(
            AiMockInterview interview,
            AiMockInterviewQuestion answeredQuestion,
            Long candidateId,
            String ip) {
        int nextIndex = interview.getCurrentQuestionIndex() + 1;
        interview.setCurrentQuestionIndex(nextIndex);

        if (nextIndex >= interview.getQuestionCount()) {
            completeSession(interview, candidateId, ip);
            AiMockInterview completed = interviewRepository.save(interview);

            return SubmitAnswerResultResource.builder()
                    .questionId(answeredQuestion.getId())
                    .questionOrder(answeredQuestion.getQuestionOrder())
                    .needsFollowUp(false)
                    .followUpQuestion(null)
                    .feedback(answeredQuestion.getFeedback())
                    .score(answeredQuestion.getScore())
                    .idealAnswer(answeredQuestion.getIdealAnswer())
                    .sessionCompleted(true)
                    .nextQuestion(null)
                    .completedSession(mapToDetail(completed))
                    .build();
        }

        AiMockInterview updated = interviewRepository.save(interview);
        List<AiMockInterviewQuestion> questions =
                questionRepository.findAllByMockInterviewIdOrderByQuestionOrderAsc(updated.getId());
        AiMockInterviewQuestion nextQuestion = questions.get(nextIndex);

        return SubmitAnswerResultResource.builder()
                .questionId(answeredQuestion.getId())
                .questionOrder(answeredQuestion.getQuestionOrder())
                .needsFollowUp(false)
                .followUpQuestion(null)
                .feedback(answeredQuestion.getFeedback())
                .score(answeredQuestion.getScore())
                .idealAnswer(answeredQuestion.getIdealAnswer())
                .sessionCompleted(false)
                .nextQuestion(mapQuestion(nextQuestion))
                .completedSession(null)
                .build();
    }

    private void completeSession(AiMockInterview interview, Long candidateId, String ip) {
        List<AiMockInterviewQuestion> questions =
                questionRepository.findAllByMockInterviewIdOrderByQuestionOrderAsc(
                        interview.getId());

        StringBuilder transcript = new StringBuilder();
        int totalScore = 0;
        int scoredCount = 0;

        for (AiMockInterviewQuestion q : questions) {
            transcript.append(
                    String.format(
                            "Question %d (%s): %s\n",
                            q.getQuestionOrder(), q.getCategory(), q.getQuestionText()));
            transcript.append(
                    String.format(
                            "Answer: %s\n",
                            q.getCandidateAnswer() != null ? q.getCandidateAnswer() : "N/A"));
            if (q.getFollowUpQuestion() != null) {
                transcript.append(
                        String.format("Follow-up Question: %s\n", q.getFollowUpQuestion()));
                transcript.append(
                        String.format(
                                "Follow-up Answer: %s\n",
                                q.getFollowUpAnswer() != null ? q.getFollowUpAnswer() : "N/A"));
            }
            transcript.append(
                    String.format(
                            "Score: %s | Feedback: %s\n\n",
                            q.getScore() != null ? q.getScore() : "N/A",
                            q.getFeedback() != null ? q.getFeedback() : "N/A"));

            if (q.getScore() != null) {
                totalScore += q.getScore();
                scoredCount++;
            }
        }

        String userPrompt =
                String.format(
                        "Target Role: %s\nSeniority Level: %s\nFocus Area: %s\n\nFull Session Transcript:\n%s",
                        interview.getTargetRole(),
                        interview.getSeniorityLevel(),
                        interview.getFocusArea(),
                        transcript);

        PromptTemplate systemPrompt = promptService.load(PROMPT_SUMMARY_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_SUMMARY, candidateId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(userPrompt)), List.of());

        try {
            AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
            SessionSummary summary = parseSessionSummary(aiResult.text());

            interview.setOverallScore(summary.overallScore());
            interview.setOverallFeedback(summary.overallFeedback());
            interview.setStrengthsJson(objectMapper.writeValueAsString(summary.strengths()));
            interview.setImprovementsJson(objectMapper.writeValueAsString(summary.improvements()));
        } catch (Exception ex) {
            log.warn(
                    "Failed to generate AI summary, using calculated average: {}", ex.getMessage());
            int average = scoredCount > 0 ? (totalScore / scoredCount) : 75;
            interview.setOverallScore(average);
            interview.setOverallFeedback(
                    "The interview session has been completed. The candidate answered all required questions.");
            try {
                interview.setStrengthsJson(
                        objectMapper.writeValueAsString(
                                List.of(
                                        "Trả lời đầy đủ tất cả các câu hỏi của buổi phỏng vấn",
                                        "Nắm bắt được các kiến thức nền tảng của vị trí ứng tuyển",
                                        "Có tinh thần cầu tiến và phong thái giao tiếp tự tin")));
                interview.setImprovementsJson(
                        objectMapper.writeValueAsString(
                                List.of(
                                        "Cần bổ sung các ví dụ thực tế và số liệu định lượng trong câu trả lời",
                                        "Đi sâu hơn vào các giải pháp tối ưu hiệu năng và xử lý lỗi",
                                        "Luyện tập thêm phương pháp trả lời có cấu trúc (STAR model)")));
            } catch (JsonProcessingException ignored) {
            }
        }

        interview.setStatus(MockInterviewStatus.COMPLETED);
    }

    private List<GeneratedQuestion> parseGeneratedQuestions(String text, int expectedCount) {
        List<GeneratedQuestion> questions = new ArrayList<>();
        try {
            String cleanJson = cleanJsonOutput(text);
            JsonNode root = objectMapper.readTree(cleanJson);
            JsonNode arrayNode = root.has("questions") ? root.get("questions") : root;

            if (arrayNode != null && arrayNode.isArray()) {
                int order = 1;
                for (JsonNode item : arrayNode) {
                    String category =
                            item.has("category")
                                    ? item.get("category").asText("TECHNICAL")
                                    : "TECHNICAL";
                    String qText =
                            item.has("questionText")
                                    ? item.get("questionText").asText()
                                    : item.asText();
                    if (!qText.isBlank()) {
                        questions.add(new GeneratedQuestion(order++, category, qText.trim()));
                    }
                    if (questions.size() >= expectedCount) {
                        break;
                    }
                }
            }
        } catch (Exception ex) {
            log.error("Failed to parse generated questions: {}", ex.getMessage());
        }

        if (questions.size() < 5) {
            questions.clear();
            questions.add(
                    new GeneratedQuestion(
                            1,
                            "TECHNICAL",
                            "Please introduce yourself and walk us through the most impactful technical project you have worked on."));
            questions.add(
                    new GeneratedQuestion(
                            2,
                            "TECHNICAL",
                            "In that project, what was the most complex technical challenge you encountered, and how did you resolve it?"));
            questions.add(
                    new GeneratedQuestion(
                            3,
                            "TECHNICAL",
                            "How do you approach performance optimization and ensure high availability in your backend/system architecture?"));
            questions.add(
                    new GeneratedQuestion(
                            4,
                            "SYSTEM_DESIGN",
                            "How would you design a scalable service required to handle high-throughput traffic with low latency and strong security?"));
            questions.add(
                    new GeneratedQuestion(
                            5,
                            "BEHAVIORAL",
                            "Tell me about a time you had a technical disagreement with a teammate or stakeholder. How did you handle it?"));
        }

        return questions;
    }

    private AnswerEvaluation parseAnswerEvaluation(String text) {
        try {
            String cleanJson = cleanJsonOutput(text);
            JsonNode root = objectMapper.readTree(cleanJson);

            int score = root.has("score") ? root.get("score").asInt(75) : 75;
            boolean needsFollowUp =
                    root.has("needsFollowUp") && root.get("needsFollowUp").asBoolean(false);
            String followUp =
                    root.has("followUpQuestion") && !root.get("followUpQuestion").isNull()
                            ? root.get("followUpQuestion").asText()
                            : null;
            String feedback =
                    root.has("feedback")
                            ? root.get("feedback").asText()
                            : "Good answer with solid foundational reasoning.";
            String ideal = root.has("idealAnswer") ? root.get("idealAnswer").asText() : "";

            return new AnswerEvaluation(score, needsFollowUp, followUp, feedback, ideal);
        } catch (Exception ex) {
            log.warn("Failed to parse evaluation JSON: {}", ex.getMessage());
            return new AnswerEvaluation(
                    75,
                    false,
                    null,
                    "The answer meets fundamental requirements.",
                    "Structure your response with concrete metrics and clear engineering trade-offs.");
        }
    }

    private SessionSummary parseSessionSummary(String text) throws JsonProcessingException {
        String cleanJson = cleanJsonOutput(text);
        JsonNode root = objectMapper.readTree(cleanJson);

        int score = root.has("overallScore") ? root.get("overallScore").asInt(75) : 75;
        String feedback =
                root.has("overallFeedback")
                        ? root.get("overallFeedback").asText()
                        : "Successfully completed the mock interview session.";

        List<String> strengths = new ArrayList<>();
        if (root.has("strengths") && root.get("strengths").isArray()) {
            for (JsonNode s : root.get("strengths")) {
                strengths.add(s.asText());
            }
        }
        while (strengths.size() < 3) {
            strengths.add("Demonstrates solid core engineering fundamentals in the target domain.");
        }
        if (strengths.size() > 3) {
            strengths = strengths.subList(0, 3);
        }

        List<String> improvements = new ArrayList<>();
        if (root.has("improvements") && root.get("improvements").isArray()) {
            for (JsonNode i : root.get("improvements")) {
                improvements.add(i.asText());
            }
        }
        while (improvements.size() < 3) {
            improvements.add(
                    "Practice structured communication and incorporate measurable impact metrics.");
        }
        if (improvements.size() > 3) {
            improvements = improvements.subList(0, 3);
        }

        return new SessionSummary(score, feedback, strengths, improvements);
    }

    private String cleanJsonOutput(String raw) {
        if (raw == null) return "{}";
        String s = raw.trim();
        if (s.startsWith("```json")) {
            s = s.substring(7);
        } else if (s.startsWith("```")) {
            s = s.substring(3);
        }
        if (s.endsWith("```")) {
            s = s.substring(0, s.length() - 3);
        }
        return s.trim();
    }

    private MockInterviewSummaryResource mapToSummary(AiMockInterview interview) {
        return MockInterviewSummaryResource.builder()
                .id(interview.getId())
                .targetRole(interview.getTargetRole())
                .seniorityLevel(interview.getSeniorityLevel())
                .focusArea(interview.getFocusArea())
                .questionCount(interview.getQuestionCount())
                .currentQuestionIndex(interview.getCurrentQuestionIndex())
                .status(interview.getStatus())
                .overallScore(interview.getOverallScore())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }

    private MockInterviewDetailResource mapToDetail(AiMockInterview interview) {
        List<String> strengths = deserializeStringList(interview.getStrengthsJson());
        List<String> improvements = deserializeStringList(interview.getImprovementsJson());

        List<AiMockInterviewQuestion> questions =
                questionRepository.findAllByMockInterviewIdOrderByQuestionOrderAsc(
                        interview.getId());
        List<MockInterviewQuestionResource> qResources =
                questions.stream().map(this::mapQuestion).toList();

        return MockInterviewDetailResource.builder()
                .id(interview.getId())
                .candidateId(interview.getCandidateId())
                .resumeId(interview.getResumeId())
                .targetRole(interview.getTargetRole())
                .seniorityLevel(interview.getSeniorityLevel())
                .focusArea(interview.getFocusArea())
                .questionCount(interview.getQuestionCount())
                .currentQuestionIndex(interview.getCurrentQuestionIndex())
                .status(interview.getStatus())
                .overallScore(interview.getOverallScore())
                .overallFeedback(interview.getOverallFeedback())
                .strengths(strengths)
                .improvements(improvements)
                .questions(qResources)
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }

    private MockInterviewQuestionResource mapQuestion(AiMockInterviewQuestion q) {
        return MockInterviewQuestionResource.builder()
                .id(q.getId())
                .questionOrder(q.getQuestionOrder())
                .category(q.getCategory())
                .questionText(q.getQuestionText())
                .candidateAnswer(q.getCandidateAnswer())
                .answeredAt(q.getAnsweredAt())
                .followUpQuestion(q.getFollowUpQuestion())
                .followUpAnswer(q.getFollowUpAnswer())
                .followUpAnsweredAt(q.getFollowUpAnsweredAt())
                .feedback(q.getFeedback())
                .score(q.getScore())
                .idealAnswer(q.getIdealAnswer())
                .build();
    }

    private List<String> deserializeStringList(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(
                    json,
                    objectMapper
                            .getTypeFactory()
                            .constructCollectionType(List.class, String.class));
        } catch (Exception ex) {
            return List.of();
        }
    }

    private String extractResumeText(Long resumeId, Long candidateId) {
        try {
            byte[] bytes = resumeService.download(resumeId, candidateId).bytes();
            var extraction = cvTextExtractorService.extractText(bytes);
            if (extraction.readable() && extraction.text() != null) {
                return extraction.text();
            }
        } catch (Exception e) {
            log.warn("Could not extract CV text from resumeId {}: {}", resumeId, e.getMessage());
        }
        return "";
    }

    private record GeneratedQuestion(int order, String category, String questionText) {}

    private record AnswerEvaluation(
            int score,
            boolean needsFollowUp,
            String followUpQuestion,
            String feedback,
            String idealAnswer) {}

    private record SessionSummary(
            int overallScore,
            String overallFeedback,
            List<String> strengths,
            List<String> improvements) {}
}
