package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.modules.ai.resources.ResumeMatchQuotaResource;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchQuotaServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResumeMatchQuotaService implements ResumeMatchQuotaServiceInterface {

    private static final String KEY_PREFIX = "ai:quota:resume_match:";

    private final AiProperties aiProperties;
    private final CompanyMonthlyAiQuotaSupport quotaSupport;

    @Override
    public ResumeMatchQuotaResource getQuota(Long recruiterUserId) {
        CompanyMonthlyAiQuotaSupport.QuotaSnapshot snapshot =
                quotaSupport.snapshot(
                        recruiterUserId,
                        KEY_PREFIX,
                        EntitlementType.AI_RESUME_MATCH,
                        aiProperties.quota().resumeMatchFreePerMonth());
        return ResumeMatchQuotaResource.builder()
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
                EntitlementType.AI_RESUME_MATCH,
                aiProperties.quota().resumeMatchFreePerMonth());
    }

    // Checked before the model call and spent after it succeeds, so a failed analysis never
    // costs a paid unit. The per-user daily AI quota already blocks abuse of that gap.
    @Override
    public void consume(Long recruiterUserId) {
        quotaSupport.consume(
                recruiterUserId,
                KEY_PREFIX,
                EntitlementType.AI_RESUME_MATCH,
                aiProperties.quota().resumeMatchFreePerMonth());
    }
}
