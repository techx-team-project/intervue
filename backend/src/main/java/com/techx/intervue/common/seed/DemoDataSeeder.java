package com.techx.intervue.common.seed;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

@Component
@Profile("local")
@RequiredArgsConstructor
public class DemoDataSeeder {

    private final List<DemoSeedStep> steps;
    private final TransactionTemplate transactionTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        steps.forEach(step -> transactionTemplate.executeWithoutResult(status -> step.seed()));
    }
}
