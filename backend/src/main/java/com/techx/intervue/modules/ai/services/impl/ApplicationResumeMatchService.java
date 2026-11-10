package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;
import com.techx.intervue.modules.ai.services.interfaces.ApplicationResumeMatchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchServiceInterface;
import com.techx.intervue.modules.application.resources.RecruiterApplicationResource;
import com.techx.intervue.modules.application.services.interfaces.RecruiterApplicationServiceInterface;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.repositories.JobRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationResumeMatchService implements ApplicationResumeMatchServiceInterface {

    private static final int MAX_REQUIREMENTS = 25;
    private static final int MIN_REQUIREMENT_LENGTH = 3;
    private static final String BULLET_PREFIX = "^[\\-\\*\\u2022\\u00b7\\d\\.\\)\\s]+";

    private final RecruiterApplicationServiceInterface recruiterApplicationService;
    private final JobRepository jobRepository;
    private final CvTextExtractorServiceInterface cvTextExtractorService;
    private final CvTextCleaner cvTextCleaner;
    private final ResumeMatchServiceInterface resumeMatchService;

    @Override
    public ResumeMatchResult analyze(Long recruiterId, String ip, Long applicationId) {
        RecruiterApplicationResource application =
                recruiterApplicationService.open(applicationId, recruiterId);
        Job job =
                jobRepository
                        .findById(application.jobId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        List<String> requirements = splitRequirements(job.getRequirements());
        if (requirements.isEmpty()) {
            throw new AppException(ErrorCode.JOB_REQUIREMENTS_MISSING);
        }

        ResumeMatchRequest request =
                new ResumeMatchRequest(
                        String.valueOf(applicationId),
                        application.jobTitle(),
                        requirements,
                        job.getDescription(),
                        null,
                        readCvText(applicationId, recruiterId));

        return resumeMatchService.analyze(recruiterId, ip, request);
    }

    private String readCvText(Long applicationId, Long recruiterId) {
        ResumeContent cv = recruiterApplicationService.downloadCv(applicationId, recruiterId);
        CvTextExtractionResult extraction = cvTextExtractorService.extractText(cv.bytes());
        if (!extraction.readable()) {
            throw new AppException(ErrorCode.CV_TEXT_NOT_READABLE);
        }
        return cvTextCleaner.clean(extraction.text());
    }

    private List<String> splitRequirements(String raw) {
        List<String> requirements = new ArrayList<>();
        if (raw == null || raw.isBlank()) {
            return requirements;
        }
        for (String line : raw.split("\\r?\\n")) {
            String cleaned = line.replaceAll(BULLET_PREFIX, "").trim();
            if (cleaned.length() < MIN_REQUIREMENT_LENGTH) {
                continue;
            }
            requirements.add(cleaned);
            if (requirements.size() == MAX_REQUIREMENTS) {
                break;
            }
        }
        return requirements;
    }
}
