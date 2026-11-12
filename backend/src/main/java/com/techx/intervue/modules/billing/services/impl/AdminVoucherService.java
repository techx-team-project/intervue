package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.enums.VoucherAccentColor;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import com.techx.intervue.modules.billing.mappers.VoucherMapper;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.repositories.VoucherRepository;
import com.techx.intervue.modules.billing.requests.SaveVoucherRequest;
import com.techx.intervue.modules.billing.resources.AdminVoucherResource;
import com.techx.intervue.modules.billing.resources.VoucherPackageSummaryResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminVoucherServiceInterface;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminVoucherService implements AdminVoucherServiceInterface {

    private static final long MAX_PERCENTAGE = 100L;
    private static final Sort DEFAULT_SORT =
            Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));
    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of(
                    "id",
                    "code",
                    "label",
                    "discountValue",
                    "minOrderValue",
                    "startsAt",
                    "endsAt",
                    "usageLimit",
                    "usedCount",
                    "status",
                    "createdAt",
                    "updatedAt");

    private final VoucherRepository voucherRepository;
    private final ServicePackageRepository packageRepository;
    private final VoucherMapper voucherMapper;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminVoucherResource> search(
            String keyword,
            VoucherStatus status,
            VoucherDiscountType discountType,
            Pageable pageable) {
        List<Sort.Order> safeOrders =
                pageable.getSort().stream()
                        .filter(order -> ALLOWED_SORT_FIELDS.contains(order.getProperty()))
                        .toList();
        Pageable resolvedPageable =
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        safeOrders.isEmpty() ? DEFAULT_SORT : Sort.by(safeOrders));
        Specification<Voucher> spec = toSpecification(keyword, status, discountType);
        Page<Voucher> page = voucherRepository.findAll(spec, resolvedPageable);
        List<Long> ids = page.getContent().stream().map(Voucher::getId).toList();
        Map<Long, List<VoucherPackageSummaryResource>> packagesByVoucher =
                voucherMapper.loadApplicablePackagesMap(ids);
        return page.map(
                voucher ->
                        voucherMapper.toAdminResource(
                                voucher,
                                packagesByVoucher.getOrDefault(voucher.getId(), List.of())));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminVoucherResource findById(Long id) {
        Voucher voucher =
                voucherRepository
                        .findByIdWithPackages(id)
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        return voucherMapper.toAdminResource(
                voucher, voucherMapper.toPackageSummaries(voucher.getApplicablePackages()));
    }

    @Override
    @Transactional
    public AdminVoucherResource create(SaveVoucherRequest request, RequestActor actor) {
        String code = request.code().trim().toUpperCase();
        if (voucherRepository.existsByCode(code)) {
            throw new AppException(ErrorCode.DUPLICATE_VOUCHER_CODE);
        }
        Voucher voucher = new Voucher();
        voucher.setCode(code);
        apply(voucher, request, null);
        Voucher saved = voucherRepository.save(voucher);
        audit(actor, AuditAction.VOUCHER_CREATED, saved);
        return voucherMapper.toAdminResource(
                saved, voucherMapper.toPackageSummaries(saved.getApplicablePackages()));
    }

    @Override
    @Transactional
    public AdminVoucherResource update(Long id, SaveVoucherRequest request, RequestActor actor) {
        Voucher voucher =
                voucherRepository
                        .findByIdWithPackages(id)
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        apply(voucher, request, voucher);
        Voucher saved = voucherRepository.save(voucher);
        audit(actor, AuditAction.VOUCHER_UPDATED, saved);
        return voucherMapper.toAdminResource(
                saved, voucherMapper.toPackageSummaries(saved.getApplicablePackages()));
    }

    @Override
    @Transactional
    public AdminVoucherResource setStatus(Long id, VoucherStatus status, RequestActor actor) {
        Voucher voucher =
                voucherRepository
                        .findByIdWithPackages(id)
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        if (voucher.getStatus() != status) {
            voucher.setStatus(status);
            voucher = voucherRepository.save(voucher);
            audit(actor, AuditAction.VOUCHER_UPDATED, voucher);
        }
        return voucherMapper.toAdminResource(
                voucher, voucherMapper.toPackageSummaries(voucher.getApplicablePackages()));
    }

    private Specification<Voucher> toSpecification(
            String keyword, VoucherStatus status, VoucherDiscountType discountType) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(
                        builder.or(
                                builder.like(builder.lower(root.get("code")), pattern),
                                builder.like(builder.lower(root.get("label")), pattern),
                                builder.like(builder.lower(root.get("description")), pattern)));
            }
            if (status != null) {
                predicates.add(builder.equal(root.get("status"), status));
            }
            if (discountType != null) {
                predicates.add(builder.equal(root.get("discountType"), discountType));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    // The code is never rewritten: a voucher already handed out must keep working
    private void apply(Voucher voucher, SaveVoucherRequest request, Voucher existing) {
        validateBusinessRules(request, existing);
        Set<ServicePackage> resolvedPackages = resolvePackages(request.applicablePackageIds());

        voucher.setLabel(request.label().trim());
        voucher.setDescription(trimToNull(request.description()));
        voucher.setRibbonLabel(normalizeRibbonLabel(request.ribbonLabel()));
        voucher.setAccentColor(
                request.accentColor() != null ? request.accentColor() : VoucherAccentColor.EMERALD);
        voucher.setConditionsJson(voucherMapper.writeConditionsJson(request.conditions()));
        voucher.getApplicablePackages().clear();
        voucher.getApplicablePackages().addAll(resolvedPackages);

        voucher.setDiscountType(request.discountType());
        voucher.setDiscountValue(request.discountValue());
        voucher.setMaxDiscount(
                request.discountType() == VoucherDiscountType.FIXED ? null : request.maxDiscount());
        voucher.setMinOrderValue(request.minOrderValue());
        voucher.setStartsAt(request.startsAt());
        voucher.setEndsAt(request.endsAt());
        voucher.setUsageLimit(request.usageLimit());
        voucher.setPerCompanyLimit(request.perCompanyLimit());
        voucher.setStatus(request.status());
    }

    private void validateBusinessRules(SaveVoucherRequest request, Voucher existing) {
        if (request.discountType() == VoucherDiscountType.PERCENTAGE
                && request.discountValue() > MAX_PERCENTAGE) {
            throw AppException.validation(
                    "discountValue", "Percentage discount cannot exceed 100%");
        }
        if (request.startsAt() != null
                && request.endsAt() != null
                && !request.endsAt().isAfter(request.startsAt())) {
            throw AppException.validation("endsAt", "End time must be after start time");
        }
        if (request.perCompanyLimit() != null
                && request.usageLimit() != null
                && request.perCompanyLimit() > request.usageLimit()) {
            throw AppException.validation(
                    "perCompanyLimit", "Per-company limit cannot exceed total redemption limit");
        }
        if (existing != null
                && request.usageLimit() != null
                && request.usageLimit() < existing.getUsedCount()) {
            throw AppException.validation(
                    "usageLimit",
                    "Usage limit cannot be lower than current redemptions ("
                            + existing.getUsedCount()
                            + ")");
        }
    }

    private Set<ServicePackage> resolvePackages(List<Long> packageIds) {
        if (packageIds == null || packageIds.isEmpty()) {
            return Set.of();
        }
        Set<Long> uniqueIds = new LinkedHashSet<>(packageIds);
        List<ServicePackage> packages = packageRepository.findAllById(uniqueIds);
        if (packages.size() != uniqueIds.size()) {
            throw AppException.validation(
                    "applicablePackageIds", "One or more selected service packages do not exist");
        }
        return new LinkedHashSet<>(packages);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeRibbonLabel(String value) {
        String trimmed = trimToNull(value);
        return trimmed == null ? null : trimmed.toUpperCase();
    }

    private void audit(RequestActor actor, AuditAction action, Voucher voucher) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.VOUCHER)
                        .targetId(voucher.getId())
                        .detail(voucher.getCode())
                        .build());
    }
}
