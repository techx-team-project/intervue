package com.techx.intervue.modules.application.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record RecruiterApplicationResource(
        Long id,
        ApplicationStatus status,
        Long jobId,
        String jobTitle,
        String candidateName,
        String candidateEmail,
        ApplicationResource.Cv cv,
        String coverLetter,
        List<ApplicationResource.Answer> answers,
        List<HistoryEntry> history,
        List<Note> notes,
        List<ApplicationStatus> nextStatuses,
        Instant submittedAt,
        Instant viewedAt,
        Instant updatedAt) {

    public record HistoryEntry(
            ApplicationStatus from,
            ApplicationStatus to,
            String actorType,
            String note,
            Instant at) {}

    public record Note(
            Long id, Long authorId, String authorName, String content, Instant createdAt) {}
}
