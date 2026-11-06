package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.CoverLetterGenerateRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.CoverLetterGenerateResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.CoverLetterServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CoverLetterService implements CoverLetterServiceInterface {

    public static final String FEATURE_NAME = "cover-letter";
    public static final String PROMPT_NAME = "cover-letter";
    public static final int PROMPT_VERSION = 1;
    public static final String PROMPT_VERSION_TAG = "cover-letter.v1";
    public static final String EDIT_NOTICE =
            "Bản nháp do AI tạo từ thông tin CV và tin tuyển dụng. Bạn có thể chỉnh sửa tự do trước khi nộp; thư không bao giờ được gửi tự động.";

    private final CandidateResumeRepository resumeRepository;
    private final CvTextCleaner cvTextCleaner;
    private final CandidatePrivacySanitizerInterface privacySanitizer;
    private final PromptServiceInterface promptService;
    private final AiGatewayServiceInterface aiGatewayService;

    @Override
    public CoverLetterGenerateResult generateCoverLetter(
            Long candidateUserId, String ip, CoverLetterGenerateRequest request) {
        if (request == null
                || request.jobTitle() == null
                || request.jobTitle().isBlank()
                || request.companyName() == null
                || request.companyName().isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        String cvContent = "";
        if (request.resumeId() != null) {
            CandidateResume resume =
                    resumeRepository
                            .findById(request.resumeId())
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            cvContent =
                    resume.getParsedSummary() != null && !resume.getParsedSummary().isBlank()
                            ? resume.getParsedSummary()
                            : resume.getFileName();
        } else if (request.cvText() != null && !request.cvText().isBlank()) {
            cvContent = cvTextCleaner.clean(request.cvText());
        }

        String sanitizedCv = privacySanitizer.sanitizeCandidateData(null, cvContent);
        privacySanitizer.validateNoSensitiveDataSent(sanitizedCv);

        String userPrompt = buildPrompt(request, sanitizedCv);

        PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_NAME, candidateUserId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(userPrompt)), List.of());

        AiChatResult result = aiGatewayService.chat(callContext, chatRequest);

        return CoverLetterGenerateResult.builder()
                .coverLetter(result.text())
                .modelVersion(result.model())
                .promptVersion(PROMPT_VERSION_TAG)
                .notice(EDIT_NOTICE)
                .build();
    }

    private String buildPrompt(CoverLetterGenerateRequest request, String cvContent) {
        StringBuilder sb = new StringBuilder();
        sb.append("Target Job Title: ").append(request.jobTitle()).append("\n");
        sb.append("Company Name: ").append(request.companyName()).append("\n");

        if (request.candidateName() != null && !request.candidateName().isBlank()) {
            sb.append("Candidate Name: ").append(request.candidateName()).append("\n");
        }

        if (request.jobRequirements() != null && !request.jobRequirements().isEmpty()) {
            sb.append("Job Requirements:\n");
            for (String req : request.jobRequirements()) {
                sb.append("- ").append(req).append("\n");
            }
        }

        if (request.jobDescription() != null && !request.jobDescription().isBlank()) {
            sb.append("Job Description Summary:\n").append(request.jobDescription()).append("\n");
        }

        sb.append("\nVerifiable Candidate CV Facts:\n");
        sb.append(
                cvContent.isBlank()
                        ? "Passionate developer eager to contribute technical problem-solving skills."
                        : cvContent);

        return sb.toString();
    }
}
