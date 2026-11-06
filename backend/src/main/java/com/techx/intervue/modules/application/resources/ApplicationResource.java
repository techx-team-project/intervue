package com.techx.intervue.modules.application.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApplicationResource(
        Long id,
        ApplicationStatus status,
        Long jobId,
        String jobTitle,
        Long companyId,
        String companyName,
        Long resumeId,
        Cv cv,
        String coverLetter,
        List<Answer> answers,
        List<HistoryEntry> history,
        Instant submittedAt,
        Instant viewedAt,
        Instant updatedAt) {

    public record Cv(String fileName, Long fileSizeBytes) {}

    public record Answer(Long questionId, String prompt, String answer) {}

    public record HistoryEntry(
            ApplicationStatus from, ApplicationStatus to, String actorType, Instant at) {}
}
