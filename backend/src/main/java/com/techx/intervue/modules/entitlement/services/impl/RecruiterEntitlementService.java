package com.techx.intervue.modules.entitlement.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import com.techx.intervue.modules.entitlement.mappers.EntitlementMapper;
import com.techx.intervue.modules.entitlement.repositories.CompanyEntitlementRepository;
import com.techx.intervue.modules.entitlement.repositories.EntitlementUsageRepository;
import com.techx.intervue.modules.entitlement.requests.ActivateEntitlementRequest;
import com.techx.intervue.modules.entitlement.resources.EntitlementResource;
import com.techx.intervue.modules.entitlement.resources.EntitlementUsageResource;
import com.techx.intervue.modules.entitlement.services.interfaces.CompanyBrandPortInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.JobBoostPortInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.RecruiterEntitlementServiceInterface;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterEntitlementService implements RecruiterEntitlementServiceInterface {

    private final CompanyEntitlementRepository entitlementRepository;
    private final EntitlementUsageRepository usageRepository;
    private final EntitlementMapper entitlementMapper;
    private final CompanyServiceInterface companyService;
    private final JobBoostPortInterface jobBoostPort;
    private final CompanyBrandPortInterface companyBrandPort;

    @Override
    @Transactional(readOnly = true)
    public List<EntitlementResource> listStock(Long recruiterId) {
        Long companyId = requireCompanyId(recruiterId);
        // Banner weeks have their own panel, not a stock card to activate here
        return entitlementRepository.findAllByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .filter(
                        entitlement ->
                                !EntitlementMapper.HIDDEN_FROM_STOCK.contains(
                                        entitlement.getEntitlementType()))
                .map(entitlementMapper::toResource)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EntitlementUsageResource> listActive(Long recruiterId) {
        Long companyId = requireCompanyId(recruiterId);
        // A spent job slot is not a running effect; the stock card already shows what is left
        List<EntitlementUsage> usages =
                usageRepository
                        .findAllByCompanyIdAndStatusOrderByEndsAtAsc(
                                companyId, EntitlementUsageStatus.ACTIVE)
                        .stream()
                        .filter(
                                usage ->
                                        EntitlementMapper.ACTIVATABLE_ON_JOB.contains(
                                                        usage.getEntitlementType())
                                                || EntitlementMapper.ACTIVATABLE_ON_COMPANY
                                                        .contains(usage.getEntitlementType()))
                        .toList();
        if (usages.isEmpty()) {
            return List.of();
        }
        Map<Long, String> labels =
                entitlementRepository
                        .findAllById(
                                usages.stream().map(EntitlementUsage::getEntitlementId).toList())
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        CompanyEntitlement::getId,
                                        CompanyEntitlement::getLabel,
                                        (first, second) -> first));
        return usages.stream()
                .map(
                        usage ->
                                entitlementMapper.toUsageResource(
                                        usage, labels.getOrDefault(usage.getEntitlementId(), "")))
                .toList();
    }

    @Override
    @Transactional
    public EntitlementResource activate(
            Long entitlementId, ActivateEntitlementRequest request, Long recruiterId) {
        Long companyId = requireCompanyId(recruiterId);
        CompanyEntitlement entitlement =
                entitlementRepository
                        .findByIdAndCompanyId(entitlementId, companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        boolean onJob =
                EntitlementMapper.ACTIVATABLE_ON_JOB.contains(entitlement.getEntitlementType());
        boolean onCompany =
                EntitlementMapper.ACTIVATABLE_ON_COMPANY.contains(entitlement.getEntitlementType());
        if (!onJob && !onCompany) {
            throw new AppException(ErrorCode.ENTITLEMENT_NOT_ACTIVATABLE);
        }
        Instant now = Instant.now();
        if (entitlement.getStatus() == EntitlementStatus.EXPIRED
                || (entitlement.getActivationDeadline() != null
                        && entitlement.getActivationDeadline().isBefore(now))) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXPIRED);
        }
        boolean instant = entitlement.getEntitlementType() == EntitlementType.JOB_RETOP;
        if (onJob) {
            if (request.jobId() == null
                    || !jobBoostPort.isPublishedJobOfCompany(request.jobId(), companyId)) {
                throw new AppException(ErrorCode.ADDON_REQUIRES_ACTIVE_JOB);
            }
            validateJobActivationConflicts(request.jobId(), entitlement.getEntitlementType());
        }
        if (entitlementRepository.consume(entitlement.getId(), 1, now) == 0) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }

        Instant endsAt = instant ? now : EntitlementService.endsAt(entitlement.getDurationDays());
        usageRepository.save(
                EntitlementUsage.builder()
                        .entitlementId(entitlement.getId())
                        .companyId(companyId)
                        .entitlementType(entitlement.getEntitlementType())
                        .jobId(onJob ? request.jobId() : null)
                        .quantity(1)
                        .activatedByRecruiterId(recruiterId)
                        .startedAt(now)
                        .endsAt(endsAt)
                        .status(
                                instant
                                        ? EntitlementUsageStatus.ENDED
                                        : EntitlementUsageStatus.ACTIVE)
                        .build());

        applyEffect(
                entitlement.getEntitlementType(),
                companyId,
                request.jobId(),
                entitlement.getTier(),
                endsAt,
                now);

        return entitlementMapper.toResource(
                entitlementRepository
                        .findByIdAndCompanyId(entitlementId, companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND)));
    }

    private void validateJobActivationConflicts(Long jobId, EntitlementType type) {
        if (type == EntitlementType.JOB_RETOP) {
            return;
        }
        boolean isLabelType =
                type == EntitlementType.JOB_LABEL_URGENT || type == EntitlementType.JOB_LABEL_HOT;
        if (usageRepository.existsByJobIdAndEntitlementTypeAndStatus(
                jobId, type, EntitlementUsageStatus.ACTIVE)) {
            throw new AppException(
                    isLabelType
                            ? ErrorCode.JOB_LABEL_CONFLICT
                            : ErrorCode.ADDON_REQUIRES_ACTIVE_JOB);
        }
        if (isLabelType) {
            EntitlementType opposite =
                    type == EntitlementType.JOB_LABEL_URGENT
                            ? EntitlementType.JOB_LABEL_HOT
                            : EntitlementType.JOB_LABEL_URGENT;
            if (usageRepository.existsByJobIdAndEntitlementTypeAndStatus(
                    jobId, opposite, EntitlementUsageStatus.ACTIVE)) {
                throw new AppException(ErrorCode.JOB_LABEL_CONFLICT);
            }
        }
    }

    private void applyEffect(
            EntitlementType type,
            Long companyId,
            Long jobId,
            int tier,
            Instant endsAt,
            Instant now) {
        switch (type) {
            case JOB_BOOST -> jobBoostPort.applyBoost(jobId, tier, endsAt);
            case JOB_LABEL_URGENT -> jobBoostPort.applyLabel(jobId, "URGENT", endsAt);
            case JOB_LABEL_HOT -> jobBoostPort.applyLabel(jobId, "HOT", endsAt);
            case JOB_HIGHLIGHT -> jobBoostPort.applyHighlight(jobId, endsAt);
            case JOB_RETOP -> jobBoostPort.applyRetop(jobId, now);
            case FEATURED_COMPANY -> companyBrandPort.grantFeatured(companyId, endsAt);
            case BRAND_PAGE -> companyBrandPort.grantBrandPage(companyId, endsAt);
            default -> throw new AppException(ErrorCode.ENTITLEMENT_NOT_ACTIVATABLE);
        }
    }

    private Long requireCompanyId(Long recruiterId) {
        try {
            CompanyResource company = companyService.findMyCompany(recruiterId);
            return company.id();
        } catch (AppException cause) {
            if (cause.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw cause;
        }
    }
}
