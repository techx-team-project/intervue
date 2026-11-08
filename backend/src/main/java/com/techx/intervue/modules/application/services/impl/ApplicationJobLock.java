package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.job.services.interfaces.JobApplicationLookupInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationJobLock implements JobApplicationLookupInterface {

    private final ApplicationRepository applicationRepository;

    @Override
    public boolean hasApplications(Long jobId) {
        return applicationRepository.existsByJobIdAndStatusNot(jobId, ApplicationStatus.DRAFT);
    }
}
