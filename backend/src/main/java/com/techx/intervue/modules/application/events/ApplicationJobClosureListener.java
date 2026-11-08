package com.techx.intervue.modules.application.events;

import com.techx.intervue.modules.application.services.interfaces.RecruiterApplicationServiceInterface;
import com.techx.intervue.modules.job.events.JobClosedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationJobClosureListener {

    private final RecruiterApplicationServiceInterface applicationService;

    @EventListener
    public void onJobClosed(JobClosedEvent event) {
        applicationService.closeForJob(event.jobId());
    }
}
