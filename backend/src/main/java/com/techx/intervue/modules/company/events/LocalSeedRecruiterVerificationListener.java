package com.techx.intervue.modules.company.events;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.company.services.interfaces.LocalDemoCompanyServiceInterface;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class LocalSeedRecruiterVerificationListener {

    private static final String LOCAL_IP = "127.0.0.1";

    private final RecruiterServiceInterface recruiterService;
    private final LocalDemoCompanyServiceInterface demoCompanyService;

    @EventListener(ApplicationReadyEvent.class)
    @Order(Ordered.LOWEST_PRECEDENCE)
    public void onApplicationReady() {
        recruiterService.findByIds(recruiterService.findActiveIds()).forEach(this::verify);
    }

    private void verify(RecruiterResource recruiter) {
        try {
            demoCompanyService.prepare(
                    new RequestActor(recruiter.id(), recruiter.email(), LOCAL_IP));
        } catch (AppException exception) {
            log.warn(
                    "Could not verify local recruiter {}: {}",
                    recruiter.id(),
                    exception.getMessage());
        }
    }
}
