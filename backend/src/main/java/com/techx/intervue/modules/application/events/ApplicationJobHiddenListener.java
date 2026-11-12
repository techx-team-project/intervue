package com.techx.intervue.modules.application.events;

import com.techx.intervue.modules.application.services.interfaces.RecruiterApplicationServiceInterface;
import com.techx.intervue.modules.job.events.JobHiddenEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationJobHiddenListener {

    private final RecruiterApplicationServiceInterface applicationService;

    @EventListener
    public void onJobHidden(JobHiddenEvent event) {
        applicationService.notifyApplicantsJobHidden(event.jobId());
    }
}
