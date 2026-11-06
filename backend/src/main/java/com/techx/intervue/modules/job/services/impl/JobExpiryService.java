package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.services.interfaces.JobExpiryServiceInterface;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobExpiryService implements JobExpiryServiceInterface {

    private final JobRepository jobRepository;
    private final JobStatusPolicy statusPolicy;

    @Override
    @Transactional
    @Scheduled(cron = "0 5 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public int expireOverdueJobs() {
        List<JobStatus> expirable =
                Arrays.stream(JobStatus.values())
                        .filter(status -> statusPolicy.canTransition(status, JobStatus.EXPIRED))
                        .toList();
        int expired =
                jobRepository.transitionOverdue(
                        expirable, JobStatus.EXPIRED, JobDeadlines.today(), Instant.now());
        if (expired > 0) {
            log.info("Expired {} overdue jobs", expired);
        }
        return expired;
    }
}
