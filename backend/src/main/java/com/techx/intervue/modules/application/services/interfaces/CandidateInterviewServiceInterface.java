package com.techx.intervue.modules.application.services.interfaces;

import com.techx.intervue.modules.application.resources.InterviewResource;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CandidateInterviewServiceInterface {

    Page<InterviewResource> list(Pageable pageable, Long candidateId);

    InterviewResource confirm(Long interviewId, Long candidateId);

    InterviewResource decline(Long interviewId, String reason, Long candidateId);

    InterviewResource requestReschedule(
            Long interviewId, Instant proposedStartsAt, String message, Long candidateId);

    byte[] calendarFile(Long interviewId, Long candidateId);
}
