package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.modules.ai.resources.JdGenerateQuotaResource;
import com.techx.intervue.modules.ai.services.interfaces.JdGenerateQuotaServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JdGenerateQuotaService implements JdGenerateQuotaServiceInterface {

    private static final String KEY_PREFIX = "ai:quota:jd_generate:";

    private final AiProperties aiProperties;
    private final CompanyMonthlyAiQuotaSupport quotaSupport;

    @Override
    public JdGenerateQuotaResource getQuota(Long recruiterUserId) {
        CompanyMonthlyAiQuotaSupport.QuotaSnapshot snapshot =
                quotaSupport.snapshot(
                        recruiterUserId,
                        KEY_PREFIX,
                        EntitlementType.AI_JD_GENERATE,
                        aiProperties.quota().jdGenerateFreePerMonth());
        return JdGenerateQuotaResource.builder()
                .freeUsedThisMonth(snapshot.freeUsedThisMonth())
                .freeLimit(snapshot.freeLimit())
                .freeRemaining(snapshot.freeRemaining())
                .paidRemaining(snapshot.paidRemaining())
                .totalRemaining(snapshot.totalRemaining())
                .resetAt(snapshot.resetAt())
                .build();
    }

    @Override
    public void assertHasQuota(Long recruiterUserId) {
        quotaSupport.assertHasQuota(
                recruiterUserId,
                KEY_PREFIX,
                EntitlementType.AI_JD_GENERATE,
                aiProperties.quota().jdGenerateFreePerMonth());
    }

    @Override
    public void consume(Long recruiterUserId) {
        quotaSupport.consume(
                recruiterUserId,
                KEY_PREFIX,
                EntitlementType.AI_JD_GENERATE,
                aiProperties.quota().jdGenerateFreePerMonth());
    }
}
