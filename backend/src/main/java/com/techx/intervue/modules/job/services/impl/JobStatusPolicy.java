package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.policy.StatusTransitionPolicy;
import com.techx.intervue.modules.job.enums.JobStatus;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class JobStatusPolicy extends StatusTransitionPolicy<JobStatus> {

    public JobStatusPolicy() {
        super(
                JobStatus.class,
                Map.of(
                        JobStatus.DRAFT, Set.of(JobStatus.PUBLISHED),
                        JobStatus.PUBLISHED,
                                Set.of(
                                        JobStatus.PAUSED,
                                        JobStatus.CLOSED,
                                        JobStatus.EXPIRED,
                                        JobStatus.HIDDEN_BY_ADMIN),
                        JobStatus.PAUSED,
                                Set.of(
                                        JobStatus.PUBLISHED,
                                        JobStatus.CLOSED,
                                        JobStatus.EXPIRED,
                                        JobStatus.HIDDEN_BY_ADMIN),
                        JobStatus.HIDDEN_BY_ADMIN,
                                Set.of(JobStatus.PUBLISHED, JobStatus.EXPIRED, JobStatus.CLOSED),
                        JobStatus.CLOSED, Set.of(JobStatus.PUBLISHED),
                        JobStatus.EXPIRED, Set.of(JobStatus.PUBLISHED)));
    }
}
