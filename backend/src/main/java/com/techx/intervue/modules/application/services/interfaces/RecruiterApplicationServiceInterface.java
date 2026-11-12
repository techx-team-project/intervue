package com.techx.intervue.modules.application.services.interfaces;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.requests.SearchRecruiterApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationStatusCountsResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationSummaryResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruiterApplicationServiceInterface {

    Page<RecruiterApplicationSummaryResource> search(
            SearchRecruiterApplicationsRequest request, Pageable pageable, Long recruiterId);

    ApplicationStatusCountsResource countByStatus(Long jobId, Long recruiterId);

    RecruiterApplicationResource open(Long applicationId, Long recruiterId);

    RecruiterApplicationResource changeStatus(
            Long applicationId, ApplicationStatus status, String note, Long recruiterId);

    RecruiterApplicationResource addNote(Long applicationId, String content, Long recruiterId);

    RecruiterApplicationResource deleteNote(Long applicationId, Long noteId, Long recruiterId);

    ResumeContent downloadCv(Long applicationId, Long recruiterId);

    void closeForJob(Long jobId);

    void notifyApplicantsJobHidden(Long jobId);
}
