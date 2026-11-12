package com.techx.intervue.modules.application.events;

import com.techx.intervue.modules.application.services.interfaces.RecruiterApplicationServiceInterface;
import com.techx.intervue.modules.job.events.JobTermsChangedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationJobTermsChangedListener {

    private final RecruiterApplicationServiceInterface applicationService;

    @EventListener
    public void onJobTermsChanged(JobTermsChangedEvent event) {
        applicationService.notifyApplicantsJobTermsChanged(event.jobId(), event.changes());
    }
}
