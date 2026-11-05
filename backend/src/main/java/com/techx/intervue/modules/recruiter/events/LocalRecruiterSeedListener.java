package com.techx.intervue.modules.recruiter.events;

import com.techx.intervue.config.SeedProperties;
import com.techx.intervue.config.SeedProperties.SeedRecruiter;
import com.techx.intervue.modules.recruiter.services.interfaces.LocalRecruiterSeedServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class LocalRecruiterSeedListener {

    private final SeedProperties seedProperties;
    private final LocalRecruiterSeedServiceInterface localRecruiterSeedService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        seedProperties.recruiters().forEach(this::seed);
    }

    private void seed(String key, SeedRecruiter recruiter) {
        if (!StringUtils.hasText(recruiter.password())) {
            log.warn("Skipping seed recruiter '{}': password is not configured", key);
            return;
        }
        if (!StringUtils.hasText(recruiter.email()) || !StringUtils.hasText(recruiter.name())) {
            log.warn("Skipping seed recruiter '{}': email and name are required", key);
            return;
        }

        boolean created =
                localRecruiterSeedService.createIfAbsent(
                        recruiter.name(), recruiter.email(), recruiter.password());
        if (created) {
            log.info("Seeded local recruiter '{}'", key);
        } else {
            log.info("Seed recruiter '{}' already exists", key);
        }
    }
}
