package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.JobContentWarningResource;
import com.techx.intervue.modules.job.services.interfaces.JobContentWarningServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobContentWarningService implements JobContentWarningServiceInterface {

    private final JobRepository jobRepository;
    private final JobContentScreener contentScreener;

    @Override
    @Transactional(readOnly = true)
    public List<JobContentWarningResource> warningsOf(Long jobId) {
        return jobRepository
                .findById(jobId)
                .filter(job -> job.getStatus() != JobStatus.DRAFT)
                .map(contentScreener::warningsOf)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
