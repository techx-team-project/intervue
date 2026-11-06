package com.techx.intervue.modules.application.mappers;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.resources.ApplicationResource;
import com.techx.intervue.modules.application.resources.ApplicationSummaryResource;
import com.techx.intervue.modules.job.resources.ScreeningQuestionResource;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface.ApplyQuestion;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public ApplicationResource toResource(Application application) {
        return ApplicationResource.builder()
                .id(application.getId())
                .status(application.getStatus())
                .jobId(application.getJobId())
                .jobTitle(application.getJobTitle())
                .companyId(application.getCompanyId())
                .companyName(application.getCompanyName())
                .resumeId(application.getDraftResumeId())
                .cv(
                        application.getCvFileName() == null
                                ? null
                                : new ApplicationResource.Cv(
                                        application.getCvFileName(),
                                        application.getCvFileSizeBytes()))
                .coverLetter(application.getCoverLetter())
                .answers(
                        application.getAnswers().stream()
                                .map(
                                        answer ->
                                                new ApplicationResource.Answer(
                                                        answer.getQuestionId(),
                                                        answer.getQuestionPrompt(),
                                                        answer.getAnswerText()))
                                .toList())
                .history(
                        application.getHistory().stream()
                                .map(
                                        entry ->
                                                new ApplicationResource.HistoryEntry(
                                                        entry.getFromStatus(),
                                                        entry.getToStatus(),
                                                        entry.getActorType().name(),
                                                        entry.getCreatedAt()))
                                .toList())
                .submittedAt(application.getSubmittedAt())
                .viewedAt(application.getViewedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }

    public ApplicationSummaryResource toSummary(Application application) {
        return ApplicationSummaryResource.builder()
                .id(application.getId())
                .status(application.getStatus())
                .jobId(application.getJobId())
                .jobTitle(application.getJobTitle())
                .companyId(application.getCompanyId())
                .companyName(application.getCompanyName())
                .submittedAt(application.getSubmittedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }

    public ScreeningQuestionResource toQuestion(ApplyQuestion question) {
        return new ScreeningQuestionResource(
                question.id(),
                question.type(),
                question.prompt(),
                question.required(),
                question.options());
    }
}
