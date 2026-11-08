package com.techx.intervue.modules.application.services.interfaces;

import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.requests.ScheduleInterviewRequest;
import com.techx.intervue.modules.application.resources.InterviewResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruiterInterviewServiceInterface {

    Page<InterviewResource> search(InterviewStatus status, Pageable pageable, Long recruiterId);

    List<InterviewResource> listForApplication(Long applicationId, Long recruiterId);

    InterviewResource schedule(
            Long applicationId, ScheduleInterviewRequest request, Long recruiterId);

    InterviewResource update(Long interviewId, ScheduleInterviewRequest request, Long recruiterId);

    InterviewResource acceptProposal(Long interviewId, Long recruiterId);

    InterviewResource cancel(Long interviewId, String reason, Long recruiterId);
}
