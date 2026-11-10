package com.techx.intervue.modules.entitlement.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import com.techx.intervue.modules.entitlement.repositories.CompanyEntitlementRepository;
import com.techx.intervue.modules.entitlement.repositories.EntitlementUsageRepository;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.UnusedUnits;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
    public Optional<Integer> consumeJobSlot(Long companyId, Long jobId, Long recruiterId) {
        return spend(companyId, EntitlementType.JOB_POST_SLOT, jobId, recruiterId)
                .map(CompanyEntitlement::getDurationDays);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<Long> companiesWithAlertPush(Collection<Long> companyIds) {
        if (companyIds.isEmpty()) {
            return Set.of();
        }
        return entitlementRepository
                .findAllByCompanyIdInAndEntitlementTypeAndStatus(
                        companyIds, EntitlementType.JOB_ALERT_PUSH, EntitlementStatus.AVAILABLE)
                .stream()
                .map(CompanyEntitlement::getCompanyId)
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public boolean consumeAlertPush(Long companyId, Long jobId) {
        return spend(companyId, EntitlementType.JOB_ALERT_PUSH, jobId, null).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public int remainingOf(Long companyId, EntitlementType type) {
        return entitlementRepository
                .findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                        companyId, type, EntitlementStatus.AVAILABLE)
                .stream()
                .mapToInt(CompanyEntitlement::getRemainingQuantity)
                .sum();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Instant> nearestExpiryOf(Long companyId, EntitlementType type) {
        return entitlementRepository
                .findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                        companyId, type, EntitlementStatus.AVAILABLE)
                .stream()
                .map(CompanyEntitlement::getActivationDeadline)
                .findFirst();
    }

    @Override
    @Transactional
    public boolean consumeUnit(Long companyId, EntitlementType type) {
        return spend(companyId, type, null, null).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnusedUnits> unusedFromOrderItems(Collection<Long> orderItemIds) {
        if (orderItemIds.isEmpty()) {
            return List.of();
        }
        return entitlementRepository.findAllBySourceOrderItemIdIn(orderItemIds).stream()
                .map(
                        entitlement ->
                                new UnusedUnits(
                                        entitlement.getSourceOrderItemId(),
                                        entitlement.getTotalQuantity(),
                                        entitlement.getStatus() == EntitlementStatus.AVAILABLE
                                                ? entitlement.getRemainingQuantity()
                                                : 0))
                .toList();
    }

    @Override
    @Transactional
    public void revokeUnusedFromOrderItems(Collection<Long> orderItemIds) {
        if (orderItemIds.isEmpty()) {
            return;
        }
        for (CompanyEntitlement entitlement :
                entitlementRepository.findAllBySourceOrderItemIdIn(orderItemIds)) {
            if (entitlement.getStatus() != EntitlementStatus.AVAILABLE) {
                continue;
            }
            entitlement.setRemainingQuantity(0);
            entitlement.setStatus(EntitlementStatus.REVOKED);
        }
    }

    @Override
    @Transactional
    public void consumeUnits(Long companyId, EntitlementType type, int amount) {
        if (amount <= 0 || remainingOf(companyId, type) < amount) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }

        int left = amount;
        for (CompanyEntitlement candidate :
                entitlementRepository
                        .findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                                companyId, type, EntitlementStatus.AVAILABLE)) {
            if (left == 0) {
                break;
            }
            int take = Math.min(left, candidate.getRemainingQuantity());
            if (entitlementRepository.consume(candidate.getId(), take) == 0) {
                continue;
            }
            usageRepository.save(
                    EntitlementUsage.builder()
                            .entitlementId(candidate.getId())
                            .companyId(companyId)
                            .entitlementType(type)
                            .quantity(take)
                            .startedAt(Instant.now())
                            .status(EntitlementUsageStatus.ENDED)
                            .build());
            left -= take;
        }

        if (left > 0) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }
    }

    // Nearest activation deadline first, so stock that would expire soonest is used up first
    private Optional<CompanyEntitlement> spend(
            Long companyId, EntitlementType type, Long jobId, Long recruiterId) {
        List<CompanyEntitlement> candidates =
                entitlementRepository
                        .findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                                companyId, type, EntitlementStatus.AVAILABLE);

        for (CompanyEntitlement candidate : candidates) {
            if (entitlementRepository.consume(candidate.getId(), 1) == 0) {
                continue;
            }
            usageRepository.save(
                    EntitlementUsage.builder()
                            .entitlementId(candidate.getId())
                            .companyId(companyId)
                            .entitlementType(type)
                            .jobId(jobId)
                            .quantity(1)
                            .activatedByRecruiterId(recruiterId)
                            .startedAt(Instant.now())
                            .endsAt(endsAt(candidate.getDurationDays()))
                            .status(EntitlementUsageStatus.ACTIVE)
                            .build());
            return Optional.of(candidate);
        }
        return Optional.empty();
    }

    static Instant endsAt(Integer durationDays) {
        return durationDays == null ? null : Instant.now().plus(Duration.ofDays(durationDays));
    }
}
