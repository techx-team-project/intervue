package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.job.requests.AdminSearchJobsRequest;
import com.techx.intervue.modules.job.resources.AdminJobSummaryResource;
import com.techx.intervue.modules.job.resources.JobContentWarningResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminJobServiceInterface {

    Page<AdminJobSummaryResource> search(AdminSearchJobsRequest request, Pageable pageable);

    JobStatusCountsResource countByStatus();

    JobResource findOne(Long jobId);

    List<JobContentWarningResource> contentWarnings(Long jobId);

    JobResource hide(Long jobId, String reason, RequestActor actor);

    JobResource restore(Long jobId, RequestActor actor);
}
