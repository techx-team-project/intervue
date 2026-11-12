package com.techx.intervue.modules.entitlement.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import com.techx.intervue.modules.entitlement.repositories.CompanyEntitlementRepository;
import com.techx.intervue.modules.entitlement.repositories.CompanyEntitlementRepository.CompanyCreditSummaryProjection;
import com.techx.intervue.modules.entitlement.repositories.EntitlementUsageRepository;
import com.techx.intervue.modules.entitlement.repositories.EntitlementUsageRepository.CompanyUsageSumProjection;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
                                                .tier(grant.tier() == null ? 1 : grant.tier())
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
        long days =
                grant.type() == EntitlementType.CREDIT
                        ? validityDays
                        : Math.max(ACTIVATION_WINDOW_DAYS, validityDays);
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
    public boolean consumeRetop(Long companyId, Long jobId, Long recruiterId) {
        return spend(companyId, EntitlementType.JOB_RETOP, jobId, recruiterId, true).isPresent();
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
                                    entitlement.getTier() == null ? 1 : entitlement.getTier(),
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
                                .note("Thu hồi do hoàn tiền: " + entitlement.getLabel())
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
    public ConsumeResult consumeUnits(
            Long companyId, EntitlementType type, int amount, String note, Long actorUserId) {
        ErrorCode insufficientError =
                type == EntitlementType.CREDIT
                        ? ErrorCode.INSUFFICIENT_CREDITS
                        : ErrorCode.ENTITLEMENT_EXHAUSTED;
        if (amount <= 0 || remainingOf(companyId, type) < amount) {
            throw new AppException(insufficientError);
        }

        Instant now = Instant.now();
        String batchKey = UUID.randomUUID().toString();
        Instant earliestDeadline = null;
        int left = amount;
        List<EntitlementUsage> usages = new ArrayList<>();
        for (CompanyEntitlement candidate :
                entitlementRepository.findUsableLots(companyId, type, now)) {
            if (left == 0) {
                break;
            }
            int take = Math.min(left, candidate.getRemainingQuantity());
            if (entitlementRepository.consume(candidate.getId(), take, now) == 0) {
                continue;
            }
            Instant candidateDeadline = candidate.getActivationDeadline();
            if (candidateDeadline != null
                    && (earliestDeadline == null || candidateDeadline.isBefore(earliestDeadline))) {
                earliestDeadline = candidateDeadline;
            }
            usages.add(
                    EntitlementUsage.builder()
                            .entitlementId(candidate.getId())
                            .companyId(companyId)
                            .entitlementType(type)
                            .quantity(take)
                            .note(note)
                            .batchKey(batchKey)
                            .activatedByRecruiterId(actorUserId)
                            .startedAt(now)
                            .endsAt(now)
                            .status(EntitlementUsageStatus.ENDED)
                            .build());
            left -= take;
        }

        if (left > 0) {
            throw new AppException(insufficientError);
        }
        usageRepository.saveAll(usages);
        return new ConsumeResult(earliestDeadline, batchKey);
    }

    private static final String CONVERSION_LABEL = "Đổi credits sang tiện ích";

    @Override
    @Transactional(readOnly = true)
    public Page<LedgerEntry> ledgerOf(Long companyId, EntitlementType type, Pageable pageable) {
        Instant now = Instant.now();
        List<LedgerEntry> entries = new ArrayList<>();
        for (CompanyEntitlement grant :
                entitlementRepository.findAllByCompanyIdAndEntitlementTypeOrderByCreatedAtDesc(
                        companyId, type)) {
            entries.add(
                    new LedgerEntry(
                            true,
                            grant.getTotalQuantity(),
                            grant.getLabel(),
                            grant.getCreatedAt(),
                            grant.getPurchasedByRecruiterId()));
            boolean expired =
                    grant.getStatus() == EntitlementStatus.EXPIRED
                            || (grant.getStatus() == EntitlementStatus.AVAILABLE
                                    && grant.getActivationDeadline() != null
                                    && !grant.getActivationDeadline().isAfter(now));
            if (expired && grant.getRemainingQuantity() > 0) {
                Instant expiredAt =
                        grant.getActivationDeadline() != null
                                ? grant.getActivationDeadline()
                                : grant.getUpdatedAt();
                entries.add(
                        new LedgerEntry(
                                false,
                                grant.getRemainingQuantity(),
                                "Hết hạn: " + grant.getLabel(),
                                expiredAt,
                                null));
            }
        }

        Map<String, List<EntitlementUsage>> batched = new LinkedHashMap<>();
        for (EntitlementUsage usage :
                usageRepository.findAllByCompanyIdAndEntitlementTypeOrderByStartedAtDesc(
                        companyId, type)) {
            if (usage.getBatchKey() != null) {
                batched.computeIfAbsent(usage.getBatchKey(), key -> new ArrayList<>()).add(usage);
            } else {
                entries.add(
                        new LedgerEntry(
                                false,
                                usage.getQuantity(),
                                usage.getNote() != null ? usage.getNote() : CONVERSION_LABEL,
                                usage.getStartedAt(),
                                usage.getActivatedByRecruiterId()));
            }
        }

        for (List<EntitlementUsage> group : batched.values()) {
            int sum = group.stream().mapToInt(EntitlementUsage::getQuantity).sum();
            String label =
                    group.stream()
                            .map(EntitlementUsage::getNote)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(CONVERSION_LABEL);
            Instant at =
                    group.stream()
                            .map(EntitlementUsage::getStartedAt)
                            .max(Comparator.naturalOrder())
                            .orElse(now);
            Long actorId =
                    group.stream()
                            .map(EntitlementUsage::getActivatedByRecruiterId)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null);
            entries.add(new LedgerEntry(false, sum, label, at, actorId));
        }

        entries.sort(Comparator.comparing(LedgerEntry::at).reversed());
        if (pageable == null || pageable.isUnpaged()) {
            int fallbackSize = Math.max(entries.size(), 1);
            return new PageImpl<>(entries, PageRequest.of(0, fallbackSize), entries.size());
        }
        int page = Math.max(pageable.getPageNumber(), 0);
        int size = Math.min(Math.max(pageable.getPageSize(), 1), 100);
        PageRequest effective = PageRequest.of(page, size);
        int start = (int) Math.min((long) page * size, entries.size());
        int end = Math.min(start + size, entries.size());
        return new PageImpl<>(entries.subList(start, end), effective, entries.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, CompanyStockSummary> summarizeStockByCompanyIds(
            Collection<Long> companyIds, EntitlementType type) {
        if (companyIds == null || companyIds.isEmpty()) {
            return Map.of();
        }
        Instant now = Instant.now();
        Map<Long, CompanyCreditSummaryProjection> lotsByCompany = new HashMap<>();
        for (CompanyCreditSummaryProjection row :
                entitlementRepository.summarizeByCompanyIds(companyIds, type, now)) {
            lotsByCompany.put(row.getCompanyId(), row);
        }
        Map<Long, Long> spentByCompany = new HashMap<>();
        for (CompanyUsageSumProjection row :
                usageRepository.sumQuantityByCompanyIds(companyIds, type)) {
            spentByCompany.put(row.getCompanyId(), row.getTotalSpent());
        }
        Map<Long, CompanyStockSummary> result = new HashMap<>();
        for (Long companyId : companyIds) {
            CompanyCreditSummaryProjection lot = lotsByCompany.get(companyId);
            long available = lot != null ? lot.getAvailableBalance() : 0L;
            long granted = lot != null ? lot.getLifetimeGranted() : 0L;
            long expired = lot != null ? lot.getExpiredBalance() : 0L;
            Instant nearest = lot != null ? lot.getNearestExpiry() : null;
            long spent = spentByCompany.getOrDefault(companyId, 0L);
            result.put(
                    companyId,
                    new CompanyStockSummary(
                            companyId, available, granted, spent, expired, nearest));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EntitlementLotView> lotsOf(Long companyId, EntitlementType type) {
        Instant now = Instant.now();
        return entitlementRepository
                .findAllByCompanyIdAndEntitlementTypeOrderByCreatedAtDesc(companyId, type)
                .stream()
                .map(
                        lot -> {
                            EntitlementStatus effectiveStatus =
                                    lot.getStatus() == EntitlementStatus.AVAILABLE
                                                    && lot.getActivationDeadline() != null
                                                    && !lot.getActivationDeadline().isAfter(now)
                                            ? EntitlementStatus.EXPIRED
                                            : lot.getStatus();
                            return new EntitlementLotView(
                                    lot.getId(),
                                    lot.getSourceOrderItemId(),
                                    lot.getEntitlementType(),
                                    lot.getLabel(),
                                    lot.getTotalQuantity(),
                                    lot.getRemainingQuantity(),
                                    lot.getTier() == null ? 1 : lot.getTier(),
                                    lot.getDurationDays(),
                                    lot.isBonus(),
                                    effectiveStatus,
                                    lot.getActivationDeadline(),
                                    lot.getCreatedAt());
                        })
                .toList();
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
