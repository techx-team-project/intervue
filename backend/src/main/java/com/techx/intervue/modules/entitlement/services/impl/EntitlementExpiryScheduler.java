package com.techx.intervue.modules.entitlement.services.impl;

import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import com.techx.intervue.modules.entitlement.repositories.CompanyEntitlementRepository;
import com.techx.intervue.modules.entitlement.repositories.EntitlementUsageRepository;
import com.techx.intervue.modules.entitlement.services.interfaces.JobBoostPortInterface;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class EntitlementExpiryScheduler {

    private final CompanyEntitlementRepository entitlementRepository;
    private final EntitlementUsageRepository usageRepository;
    private final JobBoostPortInterface jobBoostPort;

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void endExpiredUsages() {
        Instant now = Instant.now();
        List<EntitlementUsage> expired =
                usageRepository.findAllByStatusAndEndsAtBefore(EntitlementUsageStatus.ACTIVE, now);

        for (EntitlementUsage usage : expired) {
            usage.setStatus(EntitlementUsageStatus.ENDED);
            if (usage.getJobId() == null) {
                continue;
            }
            // The job stays published; only the paid-for display effect ends
            switch (usage.getEntitlementType()) {
                case JOB_LABEL_HOT -> jobBoostPort.clearExpiredLabel(usage.getJobId(), "HOT");
                case JOB_HIGHLIGHT -> jobBoostPort.clearExpiredHighlight(usage.getJobId());
                default -> {}
            }
        }

        int expiredStock = entitlementRepository.expireOverdue(now);
        if (!expired.isEmpty() || expiredStock > 0) {
            log.info(
                    "Ended {} service usages and expired {} unused services",
                    expired.size(),
                    expiredStock);
        }
    }
}
