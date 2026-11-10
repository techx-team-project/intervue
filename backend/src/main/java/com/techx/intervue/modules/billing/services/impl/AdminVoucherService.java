package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.repositories.VoucherRepository;
import com.techx.intervue.modules.billing.requests.SaveVoucherRequest;
import com.techx.intervue.modules.billing.resources.AdminVoucherResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminVoucherServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminVoucherService implements AdminVoucherServiceInterface {

    private final VoucherRepository voucherRepository;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminVoucherResource> search(String keyword, Pageable pageable) {
        return voucherRepository.findAll(matching(keyword), pageable).map(this::toResource);
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
        apply(voucher, request);
        Voucher saved = voucherRepository.save(voucher);
        audit(actor, AuditAction.VOUCHER_CREATED, saved);
        return toResource(saved);
    }

    @Override
    @Transactional
    public AdminVoucherResource update(Long id, SaveVoucherRequest request, RequestActor actor) {
        Voucher voucher =
                voucherRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        apply(voucher, request);
        Voucher saved = voucherRepository.save(voucher);
        audit(actor, AuditAction.VOUCHER_UPDATED, saved);
        return toResource(saved);
    }

    private Specification<Voucher> matching(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        String pattern = "%" + keyword.trim().toLowerCase() + "%";
        return (root, query, builder) ->
                builder.or(
                        builder.like(builder.lower(root.get("code")), pattern),
                        builder.like(builder.lower(root.get("label")), pattern));
    }

    // The code is never rewritten: a voucher already handed out must keep working
    private void apply(Voucher voucher, SaveVoucherRequest request) {
        voucher.setLabel(request.label().trim());
        voucher.setDescription(request.description());
        voucher.setDiscountType(request.discountType());
        voucher.setDiscountValue(request.discountValue());
        voucher.setMaxDiscount(request.maxDiscount());
        voucher.setMinOrderValue(request.minOrderValue());
        voucher.setStartsAt(request.startsAt());
        voucher.setEndsAt(request.endsAt());
        voucher.setUsageLimit(request.usageLimit());
        voucher.setPerCompanyLimit(request.perCompanyLimit());
        voucher.setStatus(request.status());
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

    private AdminVoucherResource toResource(Voucher voucher) {
        return AdminVoucherResource.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .label(voucher.getLabel())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscount(voucher.getMaxDiscount())
                .minOrderValue(voucher.getMinOrderValue())
                .startsAt(voucher.getStartsAt())
                .endsAt(voucher.getEndsAt())
                .usageLimit(voucher.getUsageLimit())
                .usedCount(voucher.getUsedCount())
                .perCompanyLimit(voucher.getPerCompanyLimit())
                .status(voucher.getStatus())
                .createdAt(voucher.getCreatedAt())
                .build();
    }
}
