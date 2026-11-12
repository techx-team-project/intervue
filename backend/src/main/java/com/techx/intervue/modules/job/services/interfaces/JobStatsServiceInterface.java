package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.resources.JobStatsResource;

public interface JobStatsServiceInterface {

    JobStatsResource stats(Long jobId, int days, Long recruiterId);
}
