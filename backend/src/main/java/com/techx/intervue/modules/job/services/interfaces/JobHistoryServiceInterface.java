package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.resources.JobHistoryResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobHistoryServiceInterface {

    Page<JobHistoryResource> history(Long jobId, Long recruiterId, Pageable pageable);
}
