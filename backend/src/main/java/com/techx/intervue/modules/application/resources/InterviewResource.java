package com.techx.intervue.modules.application.resources;

import com.techx.intervue.modules.application.enums.InterviewFormat;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
public record InterviewResource(
        Long id,
        Long applicationId,
        Long jobId,
        String jobTitle,
        String companyName,
        String candidateName,
        Instant startsAt,
        int durationMinutes,
        InterviewFormat format,
        String location,
        String note,
        InterviewStatus status,
        Instant proposedStartsAt,
        String candidateMessage,
        String cancelReason,
        Instant createdAt) {}
