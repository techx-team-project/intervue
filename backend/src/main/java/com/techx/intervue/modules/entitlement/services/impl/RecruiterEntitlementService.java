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
        // Credits and banner weeks have their own panel, not a stock card to activate here
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
                                                usage.getEntitlementType()))
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
        if (entitlement.getStatus() == EntitlementStatus.EXPIRED
                || entitlement.getActivationDeadline().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXPIRED);
        }
        if (onJob) {
            if (request.jobId() == null
                    || !jobBoostPort.isPublishedJobOfCompany(request.jobId(), companyId)) {
                throw new AppException(ErrorCode.ADDON_REQUIRES_ACTIVE_JOB);
            }
            if (usageRepository.existsByJobIdAndEntitlementTypeAndStatus(
                    request.jobId(),
                    entitlement.getEntitlementType(),
                    EntitlementUsageStatus.ACTIVE)) {
                throw new AppException(ErrorCode.ADDON_REQUIRES_ACTIVE_JOB);
            }
        }
        if (entitlementRepository.consume(entitlement.getId(), 1) == 0) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }

        Instant endsAt = EntitlementService.endsAt(entitlement.getDurationDays());
        usageRepository.save(
                EntitlementUsage.builder()
                        .entitlementId(entitlement.getId())
                        .companyId(companyId)
                        .entitlementType(entitlement.getEntitlementType())
                        .jobId(onJob ? request.jobId() : null)
                        .quantity(1)
                        .activatedByRecruiterId(recruiterId)
                        .startedAt(Instant.now())
                        .endsAt(endsAt)
                        .status(EntitlementUsageStatus.ACTIVE)
                        .build());

        applyEffect(
                entitlement.getEntitlementType(),
                companyId,
                request.jobId(),
                entitlement.getTier(),
                endsAt);

        return entitlementMapper.toResource(
                entitlementRepository
                        .findByIdAndCompanyId(entitlementId, companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND)));
    }

    private void applyEffect(
            EntitlementType type, Long companyId, Long jobId, int tier, Instant endsAt) {
        switch (type) {
            case JOB_BOOST -> jobBoostPort.applyBoost(jobId, tier, endsAt);
            case JOB_LABEL_URGENT -> jobBoostPort.applyLabel(jobId, "URGENT", endsAt);
            case JOB_LABEL_HOT -> jobBoostPort.applyLabel(jobId, "HOT", endsAt);
            case JOB_HIGHLIGHT -> jobBoostPort.applyHighlight(jobId, endsAt);
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
