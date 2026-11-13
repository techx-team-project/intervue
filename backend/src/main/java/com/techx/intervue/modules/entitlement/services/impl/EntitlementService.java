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
import java.util.ArrayList;
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

    private static final long ACTIVATION_WINDOW_DAYS = 365L;

    private final CompanyEntitlementRepository entitlementRepository;
    private final EntitlementUsageRepository usageRepository;

    @Override
    @Transactional
    public void grant(Long companyId, Long recruiterId, List<EntitlementGrant> grants) {
        Instant now = Instant.now();
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
                                                .durationDays(grant.durationDays())
                                                .bonus(grant.bonus())
                                                .status(EntitlementStatus.AVAILABLE)
                                                .activationDeadline(resolveDeadline(grant, now))
                                                .build())
                        .toList();
        entitlementRepository.saveAll(rows);
    }

    private Instant resolveDeadline(EntitlementGrant grant, Instant now) {
        if (grant.explicitDeadline() != null) {
            return grant.explicitDeadline();
        }
        if (grant.packageValidityDays() == null) {
            return null;
        }
        long validityDays = Math.max(1L, grant.packageValidityDays());
        long days = Math.max(ACTIVATION_WINDOW_DAYS, validityDays);
        return now.plus(Duration.ofDays(days));
    }

    @Override
    @Transactional
    public Optional<Integer> consumeJobSlot(Long companyId, Long jobId, Long recruiterId) {
        return spend(companyId, EntitlementType.JOB_POST_SLOT, jobId, recruiterId, false)
                .map(lot -> lot.getDurationDays() != null ? lot.getDurationDays() : 30);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Instant> jobSlotExpiresAt(Long jobId) {
        return usageRepository
                .findFirstByJobIdAndEntitlementTypeOrderByStartedAtDesc(
                        jobId, EntitlementType.JOB_POST_SLOT)
                .map(EntitlementUsage::getEndsAt);
    }

    @Override
    @Transactional
    public Optional<Instant> extendJobSlot(Long jobId, Duration pausedFor) {
        return usageRepository
                .findFirstByJobIdAndEntitlementTypeOrderByStartedAtDesc(
                        jobId, EntitlementType.JOB_POST_SLOT)
                .filter(usage -> usage.getEndsAt() != null)
                .map(
                        usage -> {
                            usage.setEndsAt(usage.getEndsAt().plus(pausedFor));
                            return usage.getEndsAt();
                        });
    }

    @Override
    @Transactional(readOnly = true)
    public Set<Long> companiesWithAlertPush(Collection<Long> companyIds) {
        if (companyIds.isEmpty()) {
            return Set.of();
        }
        Instant now = Instant.now();
        return entitlementRepository
                .findAllByCompanyIdInAndEntitlementTypeAndStatus(
                        companyIds, EntitlementType.JOB_ALERT_PUSH, EntitlementStatus.AVAILABLE)
                .stream()
                .filter(
                        lot ->
                                lot.getRemainingQuantity() > 0
                                        && (lot.getActivationDeadline() == null
                                                || lot.getActivationDeadline().isAfter(now)))
                .map(CompanyEntitlement::getCompanyId)
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public boolean consumeAlertPush(Long companyId, Long jobId) {
        return spend(companyId, EntitlementType.JOB_ALERT_PUSH, jobId, null, true).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public int remainingOf(Long companyId, EntitlementType type) {
        return entitlementRepository.findUsableLots(companyId, type, Instant.now()).stream()
                .mapToInt(CompanyEntitlement::getRemainingQuantity)
                .sum();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Instant> nearestExpiryOf(Long companyId, EntitlementType type) {
        return entitlementRepository.findNearestExpiry(companyId, type, Instant.now());
    }

    @Override
    @Transactional
    public boolean consumeUnit(Long companyId, EntitlementType type) {
        return spend(companyId, type, null, null, true).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnusedUnits> unusedFromOrderItems(Collection<Long> orderItemIds) {
        if (orderItemIds.isEmpty()) {
            return List.of();
        }
        Instant now = Instant.now();
        return entitlementRepository.findAllBySourceOrderItemIdIn(orderItemIds).stream()
                .map(
                        entitlement -> {
                            boolean usable =
                                    entitlement.getStatus() == EntitlementStatus.AVAILABLE
                                            && (entitlement.getActivationDeadline() == null
                                                    || entitlement
                                                            .getActivationDeadline()
                                                            .isAfter(now));
                            return new UnusedUnits(
                                    entitlement.getSourceOrderItemId(),
                                    entitlement.getEntitlementType(),
                                    entitlement.isBonus(),
                                    entitlement.getTotalQuantity(),
                                    usable ? entitlement.getRemainingQuantity() : 0);
                        })
                .toList();
    }

    @Override
    @Transactional
    public void revokeUnusedFromOrderItems(Collection<Long> orderItemIds) {
        if (orderItemIds.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        List<EntitlementUsage> revocations = new ArrayList<>();
        for (CompanyEntitlement entitlement :
                entitlementRepository.findAllBySourceOrderItemIdIn(orderItemIds)) {
            if (entitlement.getStatus() != EntitlementStatus.AVAILABLE) {
                continue;
            }
            int unused = entitlement.getRemainingQuantity();
            if (unused > 0) {
                revocations.add(
                        EntitlementUsage.builder()
                                .entitlementId(entitlement.getId())
                                .companyId(entitlement.getCompanyId())
                                .entitlementType(entitlement.getEntitlementType())
                                .quantity(unused)
                                .note("Revoked due to refund: " + entitlement.getLabel())
                                .batchKey("revoke:" + entitlement.getId())
                                .startedAt(now)
                                .endsAt(now)
                                .status(EntitlementUsageStatus.ENDED)
                                .build());
            }
            entitlement.setRemainingQuantity(0);
            entitlement.setStatus(EntitlementStatus.REVOKED);
        }
        if (!revocations.isEmpty()) {
            usageRepository.saveAll(revocations);
        }
    }

    @Override
    @Transactional
    public void consumeFromOrderItem(Long sourceOrderItemId, int amount) {
        Instant now = Instant.now();
        CompanyEntitlement entitlement =
                entitlementRepository.findBySourceOrderItemId(sourceOrderItemId).orElse(null);
        if (entitlement == null
                || entitlementRepository.consume(entitlement.getId(), amount, now) == 0) {
            log.warn(
                    "Could not consume {} unit(s) from order item {}: lot missing or exhausted",
                    amount,
                    sourceOrderItemId);
            return;
        }
        usageRepository.save(
                EntitlementUsage.builder()
                        .entitlementId(entitlement.getId())
                        .companyId(entitlement.getCompanyId())
                        .entitlementType(entitlement.getEntitlementType())
                        .quantity(amount)
                        .startedAt(now)
                        .endsAt(now)
                        .status(EntitlementUsageStatus.ENDED)
                        .build());
    }

    // Nearest activation deadline first, so stock that would expire soonest is used up first
    private Optional<CompanyEntitlement> spend(
            Long companyId, EntitlementType type, Long jobId, Long recruiterId, boolean instant) {
        Instant now = Instant.now();
        List<CompanyEntitlement> candidates =
                entitlementRepository.findUsableLots(companyId, type, now);

        for (CompanyEntitlement candidate : candidates) {
            if (entitlementRepository.consume(candidate.getId(), 1, now) == 0) {
                continue;
            }
            Instant endsAt = instant ? now : endsAt(candidate.getDurationDays());
            usageRepository.save(
                    EntitlementUsage.builder()
                            .entitlementId(candidate.getId())
                            .companyId(companyId)
                            .entitlementType(type)
                            .jobId(jobId)
                            .quantity(1)
                            .activatedByRecruiterId(recruiterId)
                            .startedAt(now)
                            .endsAt(endsAt)
                            .status(
                                    instant
                                            ? EntitlementUsageStatus.ENDED
                                            : EntitlementUsageStatus.ACTIVE)
                            .build());
            return Optional.of(candidate);
        }
        return Optional.empty();
    }

    static Instant endsAt(Integer durationDays) {
        return durationDays == null ? null : Instant.now().plus(Duration.ofDays(durationDays));
    }
}
