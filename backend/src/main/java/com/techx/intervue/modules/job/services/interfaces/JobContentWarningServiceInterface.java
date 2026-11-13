package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.resources.JobContentWarningResource;
import java.util.List;

public interface JobContentWarningServiceInterface {

    List<JobContentWarningResource> warningsOf(Long jobId);
}
