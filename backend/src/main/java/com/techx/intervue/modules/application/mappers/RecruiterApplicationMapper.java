package com.techx.intervue.modules.application.mappers;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.ApplicationNote;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.resources.ApplicationResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationSummaryResource;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RecruiterApplicationMapper {

    public RecruiterApplicationSummaryResource toSummary(Application application) {
        return RecruiterApplicationSummaryResource.builder()
                .id(application.getId())
                .status(application.getStatus())
                .jobId(application.getJobId())
                .jobTitle(application.getJobTitle())
                .candidateName(application.getCandidateName())
                .candidateEmail(application.getCandidateEmail())
                .viewed(application.getViewedAt() != null)
                .submittedAt(application.getSubmittedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }

    public RecruiterApplicationResource toResource(
            Application application, List<ApplicationNote> notes, List<ApplicationStatus> next) {
        return RecruiterApplicationResource.builder()
                .id(application.getId())
                .status(application.getStatus())
                .jobId(application.getJobId())
                .jobTitle(application.getJobTitle())
                .candidateName(application.getCandidateName())
                .candidateEmail(application.getCandidateEmail())
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
                                                new RecruiterApplicationResource.HistoryEntry(
                                                        entry.getFromStatus(),
                                                        entry.getToStatus(),
                                                        entry.getActorType().name(),
                                                        entry.getNote(),
                                                        entry.getCreatedAt()))
                                .toList())
                .notes(
                        notes.stream()
                                .map(
                                        note ->
                                                new RecruiterApplicationResource.Note(
                                                        note.getId(),
                                                        note.getAuthorId(),
                                                        note.getAuthorName(),
                                                        note.getContent(),
                                                        note.getCreatedAt()))
                                .toList())
                .nextStatuses(next)
                .submittedAt(application.getSubmittedAt())
                .viewedAt(application.getViewedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
