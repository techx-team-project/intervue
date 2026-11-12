package com.techx.intervue.modules.application.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.application.requests.SaveApplicationRequest;
import com.techx.intervue.modules.application.requests.SearchApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationResource;
import com.techx.intervue.modules.application.resources.ApplicationSummaryResource;
import com.techx.intervue.modules.application.resources.ApplyFormResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationServiceInterface {

    List<Long> findAppliedJobIds(Long candidateId);

    ApplyFormResource findForm(Long jobId, Long candidateId);

    ApplicationResource saveDraft(SaveApplicationRequest request, RequestActor actor);

    ApplicationResource submit(SaveApplicationRequest request, RequestActor actor);

    ApplicationResource withdraw(Long applicationId, RequestActor actor);

    ApplicationResource reapply(Long applicationId, Long resumeId, RequestActor actor);

    Page<ApplicationSummaryResource> search(
            SearchApplicationsRequest request, Pageable pageable, Long candidateId);

    ApplicationResource findOne(Long applicationId, Long candidateId);

    ResumeContent downloadCv(Long applicationId, Long candidateId);
}
