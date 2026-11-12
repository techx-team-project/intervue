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
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

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
    private static final int MIN_QUESTIONS = 5;
    private static final int MAX_QUESTIONS = 10;

    private final AiMockInterviewRepository interviewRepository;
    private final AiMockInterviewQuestionRepository questionRepository;
    private final CvTextExtractorServiceInterface cvTextExtractorService;
    private final CandidatePrivacySanitizerInterface privacySanitizer;
    private final AiGatewayServiceInterface aiGatewayService;
    private final PromptServiceInterface promptService;
    private final ObjectMapper objectMapper;
    private final TransactionTemplate transactionTemplate;

    @Override
    public MockInterviewDetailResource startSession(
            Long candidateId, StartMockInterviewRequest request, MultipartFile cvFile, String ip) {
        String cvText = cvFile == null || cvFile.isEmpty() ? "" : readableCvText(cvFile);
        String sanitizedCv = privacySanitizer.sanitizeCandidateData(null, cvText);

        int questionCount =
                Math.clamp(
                        request.questionCount() != null ? request.questionCount() : MIN_QUESTIONS,
                        MIN_QUESTIONS,
                        MAX_QUESTIONS);

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

        AiMockInterview savedInterview =
                transactionTemplate.execute(
                        status -> persistNewSession(candidateId, request, generatedQuestions));

        return mapToDetail(savedInterview);
    }

    private String readableCvText(MultipartFile cvFile) {
        CvTextExtractionResult extraction = cvTextExtractorService.extractText(cvFile);
        if (!extraction.readable() || extraction.text() == null || extraction.text().isBlank()) {
            throw new AppException(ErrorCode.CV_TEXT_NOT_READABLE);
        }
        return extraction.text();
    }

    private AiMockInterview persistNewSession(
            Long candidateId,
            StartMockInterviewRequest request,
            List<GeneratedQuestion> generatedQuestions) {
        AiMockInterview interview =
                AiMockInterview.builder()
                        .candidateId(candidateId)
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
        return savedInterview;
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
    public SubmitAnswerResultResource submitAnswer(
            Long candidateId,
            Long sessionId,
            Long questionId,
            SubmitMockAnswerRequest request,
            String ip) {
        AiMockInterview interview = requireInProgress(candidateId, sessionId);
        List<AiMockInterviewQuestion> questions = loadQuestions(interview);
        AiMockInterviewQuestion question = requireCurrentQuestion(interview, questions, questionId);
        if (question.getCandidateAnswer() != null) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        String answer = request.answer().trim();
        String evalPrompt =
                String.format(
                        "Target Role: %s (%s)\nQuestion: %s\nCandidate Answer: %s\nIs this a follow-up answer: false",
                        interview.getTargetRole(),
                        interview.getSeniorityLevel(),
                        question.getQuestionText(),
                        answer);
        AnswerEvaluation evaluation = evaluate(candidateId, ip, evalPrompt);

        question.setCandidateAnswer(answer);
        question.setAnsweredAt(Instant.now());
        question.setScore(evaluation.score());
        question.setFeedback(evaluation.feedback());
        question.setIdealAnswer(evaluation.idealAnswer());

        boolean hasFollowUp =
                evaluation.needsFollowUp()
                        && evaluation.followUpQuestion() != null
                        && !evaluation.followUpQuestion().isBlank();
        if (hasFollowUp) {
            question.setFollowUpQuestion(evaluation.followUpQuestion().trim());
            transactionTemplate.executeWithoutResult(status -> questionRepository.save(question));

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

        return advanceToNextQuestionOrComplete(interview, questions, question, candidateId, ip);
    }

    @Override
    public SubmitAnswerResultResource submitFollowUp(
            Long candidateId,
            Long sessionId,
            Long questionId,
            SubmitMockFollowUpRequest request,
            String ip) {
        AiMockInterview interview = requireInProgress(candidateId, sessionId);
        List<AiMockInterviewQuestion> questions = loadQuestions(interview);
        AiMockInterviewQuestion question = requireCurrentQuestion(interview, questions, questionId);

        if (question.getFollowUpQuestion() == null
                || question.getFollowUpQuestion().isBlank()
                || question.getFollowUpAnswer() != null) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        String followUpAnswer = request.followUpAnswer().trim();
        String evalPrompt =
                String.format(
                        "Target Role: %s (%s)\nQuestion: %s\nInitial Answer: %s\nFollow-up Question: %s\nFollow-up Answer: %s\nIs this a follow-up answer: true",
                        interview.getTargetRole(),
                        interview.getSeniorityLevel(),
                        question.getQuestionText(),
                        question.getCandidateAnswer(),
                        question.getFollowUpQuestion(),
                        followUpAnswer);
        AnswerEvaluation evaluation = evaluate(candidateId, ip, evalPrompt);

        question.setFollowUpAnswer(followUpAnswer);
        question.setFollowUpAnsweredAt(Instant.now());
        question.setScore(evaluation.score());
        if (!evaluation.feedback().isBlank()) {
            question.setFeedback(evaluation.feedback());
        }
        if (!evaluation.idealAnswer().isBlank()) {
            question.setIdealAnswer(evaluation.idealAnswer());
        }

        return advanceToNextQuestionOrComplete(interview, questions, question, candidateId, ip);
    }

    private AiMockInterview requireInProgress(Long candidateId, Long sessionId) {
        AiMockInterview interview =
                interviewRepository
                        .findByIdAndCandidateId(sessionId, candidateId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (interview.getStatus() != MockInterviewStatus.IN_PROGRESS) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }
        return interview;
    }

    private List<AiMockInterviewQuestion> loadQuestions(AiMockInterview interview) {
        return questionRepository.findAllByMockInterviewIdOrderByQuestionOrderAsc(
                interview.getId());
    }

    private AiMockInterviewQuestion requireCurrentQuestion(
            AiMockInterview interview, List<AiMockInterviewQuestion> questions, Long questionId) {
        int currentIndex = interview.getCurrentQuestionIndex();
        if (currentIndex >= questions.size()
                || !questions.get(currentIndex).getId().equals(questionId)) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }
        return questions.get(currentIndex);
    }

    private AnswerEvaluation evaluate(Long candidateId, String ip, String evalPrompt) {
        PromptTemplate systemPrompt = promptService.load(PROMPT_EVAL_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_EVAL, candidateId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(evalPrompt)), List.of());
        AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
        return parseAnswerEvaluation(aiResult.text());
    }

    private SubmitAnswerResultResource advanceToNextQuestionOrComplete(
            AiMockInterview interview,
            List<AiMockInterviewQuestion> questions,
            AiMockInterviewQuestion answeredQuestion,
            Long candidateId,
            String ip) {
        int nextIndex = interview.getCurrentQuestionIndex() + 1;
        boolean lastQuestion = nextIndex >= interview.getQuestionCount();
        SessionSummary summary =
                lastQuestion ? summarize(interview, questions, candidateId, ip) : null;

        AiMockInterview updated =
                transactionTemplate.execute(
                        status -> {
                            questionRepository.save(answeredQuestion);
                            interview.setCurrentQuestionIndex(nextIndex);
                            if (lastQuestion) {
                                applySummary(interview, questions, summary);
                            }
                            return interviewRepository.save(interview);
                        });

        return SubmitAnswerResultResource.builder()
                .questionId(answeredQuestion.getId())
                .questionOrder(answeredQuestion.getQuestionOrder())
                .needsFollowUp(false)
                .followUpQuestion(null)
                .feedback(answeredQuestion.getFeedback())
                .score(answeredQuestion.getScore())
                .idealAnswer(answeredQuestion.getIdealAnswer())
                .sessionCompleted(lastQuestion)
                .nextQuestion(lastQuestion ? null : mapQuestion(questions.get(nextIndex)))
                .completedSession(lastQuestion ? mapToDetail(updated) : null)
                .build();
    }

    private SessionSummary summarize(
            AiMockInterview interview,
            List<AiMockInterviewQuestion> questions,
            Long candidateId,
            String ip) {
        StringBuilder transcript = new StringBuilder();
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
            return parseSessionSummary(aiGatewayService.chat(callContext, chatRequest).text());
        } catch (RuntimeException | JsonProcessingException ex) {
            log.warn(
                    "Interview summary unavailable for session {}: {}",
                    interview.getId(),
                    ex.getMessage());
            return null;
        }
    }

    // Without an AI summary only the real per-question average is stored; no text is invented.
    private void applySummary(
            AiMockInterview interview,
            List<AiMockInterviewQuestion> questions,
            SessionSummary summary) {
        if (summary != null) {
            interview.setOverallScore(summary.overallScore());
            interview.setOverallFeedback(summary.overallFeedback());
            interview.setStrengthsJson(writeJson(summary.strengths()));
            interview.setImprovementsJson(writeJson(summary.improvements()));
        } else {
            questions.stream()
                    .map(AiMockInterviewQuestion::getScore)
                    .filter(Objects::nonNull)
                    .mapToInt(Integer::intValue)
                    .average()
                    .ifPresent(average -> interview.setOverallScore((int) Math.round(average)));
        }
        interview.setStatus(MockInterviewStatus.COMPLETED);
    }

    private String writeJson(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Summary is not serializable", ex);
        }
    }

    private List<GeneratedQuestion> parseGeneratedQuestions(String text, int expectedCount) {
        List<GeneratedQuestion> questions = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(cleanJsonOutput(text));
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
        } catch (JsonProcessingException ex) {
            log.error("Failed to parse generated questions: {}", ex.getMessage());
        }

        if (questions.size() < MIN_QUESTIONS) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        return questions;
    }

    private AnswerEvaluation parseAnswerEvaluation(String text) {
        JsonNode root;
        try {
            root = objectMapper.readTree(cleanJsonOutput(text));
        } catch (JsonProcessingException ex) {
            log.warn("Failed to parse evaluation JSON: {}", ex.getMessage());
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        if (!root.path("score").isNumber() || root.path("feedback").asText("").isBlank()) {
            log.warn("Evaluation JSON is missing a score or feedback");
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }

        String followUp =
                root.hasNonNull("followUpQuestion") ? root.get("followUpQuestion").asText() : null;
        return new AnswerEvaluation(
                Math.clamp(root.get("score").asInt(), 0, 100),
                root.path("needsFollowUp").asBoolean(false),
                followUp,
                root.get("feedback").asText(),
                root.path("idealAnswer").asText(""));
    }

    private SessionSummary parseSessionSummary(String text) throws JsonProcessingException {
        JsonNode root = objectMapper.readTree(cleanJsonOutput(text));
        if (!root.path("overallScore").isNumber()
                || root.path("overallFeedback").asText("").isBlank()) {
            throw new IllegalStateException("Summary JSON is missing a score or feedback");
        }

        return new SessionSummary(
                Math.clamp(root.get("overallScore").asInt(), 0, 100),
                root.get("overallFeedback").asText(),
                firstThree(root.path("strengths")),
                firstThree(root.path("improvements")));
    }

    private List<String> firstThree(JsonNode arrayNode) {
        List<String> values = new ArrayList<>();
        if (arrayNode.isArray()) {
            for (JsonNode item : arrayNode) {
                if (values.size() == 3) {
                    break;
                }
                values.add(item.asText());
            }
        }
        return values;
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
