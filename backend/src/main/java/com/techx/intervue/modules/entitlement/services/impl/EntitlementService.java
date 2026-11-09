package com.techx.intervue.modules.entitlement.services.impl;

import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import com.techx.intervue.modules.entitlement.repositories.CompanyEntitlementRepository;
import com.techx.intervue.modules.entitlement.repositories.EntitlementUsageRepository;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EntitlementService implements EntitlementServiceInterface {

    private static final Duration ACTIVATION_WINDOW = Duration.ofDays(365);

    private final CompanyEntitlementRepository entitlementRepository;
    private final EntitlementUsageRepository usageRepository;

    @Override
    @Transactional
    public void grant(Long companyId, Long recruiterId, List<EntitlementGrant> grants) {
        Instant deadline = Instant.now().plus(ACTIVATION_WINDOW);
        List<CompanyEntitlement> rows =
                grants.stream()
                        .filter(grant -> grant.quantity() != null && grant.quantity() > 0)
                        .map(
                                grant ->
                                        CompanyEntitlement.builder()
                                                .companyId(companyId)
                                                .purchasedByRecruiterId(recruiterId)
                                                .sourceOrderItemId(grant.sourceOrderItemId())
                                                .entitlementType(grant.type())
                                                .label(grant.label())
                                                .totalQuantity(grant.quantity())
                                                .remainingQuantity(grant.quantity())
                                                .tier(grant.tier() == null ? 1 : grant.tier())
                                                .durationDays(grant.durationDays())
                                                .status(EntitlementStatus.AVAILABLE)
                                                .activationDeadline(deadline)
                                                .build())
                        .toList();
        entitlementRepository.saveAll(rows);
    }

    @Override
    @Transactional
    public boolean consumeJobSlot(Long companyId, Long jobId, Long recruiterId) {
        List<CompanyEntitlement> candidates =
                entitlementRepository
                        .findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                                companyId,
                                EntitlementType.JOB_POST_SLOT,
                                EntitlementStatus.AVAILABLE);

        // Nearest deadline first so stock that would expire soonest is used up first
        for (CompanyEntitlement candidate : candidates) {
            if (entitlementRepository.consume(candidate.getId(), 1) == 0) {
                continue;
            }
            usageRepository.save(
                    EntitlementUsage.builder()
                            .entitlementId(candidate.getId())
                            .companyId(companyId)
                            .entitlementType(EntitlementType.JOB_POST_SLOT)
                            .jobId(jobId)
                            .quantity(1)
                            .activatedByRecruiterId(recruiterId)
                            .startedAt(Instant.now())
                            .endsAt(endsAt(candidate.getDurationDays()))
                            .status(EntitlementUsageStatus.ACTIVE)
                            .build());
            return true;
        }
        return false;
    }

    static Instant endsAt(Integer durationDays) {
        return durationDays == null ? null : Instant.now().plus(Duration.ofDays(durationDays));
    }
}
