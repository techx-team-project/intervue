package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.entities.RefundRequest;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.RefundRequestRepository;
import com.techx.intervue.modules.billing.requests.CreateRefundRequest;
import com.techx.intervue.modules.billing.requests.ReviewRefundRequest;
import com.techx.intervue.modules.billing.resources.RefundQuoteResource;
import com.techx.intervue.modules.billing.resources.RefundRequestResource;
import com.techx.intervue.modules.billing.resources.RefundStatusCountsResource;
import com.techx.intervue.modules.billing.services.interfaces.RefundServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.UnusedUnits;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefundService implements RefundServiceInterface {

    private static final Set<OrderStatus> REFUNDABLE =
            EnumSet.of(OrderStatus.PAID, OrderStatus.FULFILLED);

    private final RefundRequestRepository refundRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final EntitlementServiceInterface entitlementService;
    private final AdBookingServiceInterface adBookingService;
    private final RecruiterCompanyResolver companyResolver;
    private final CompanyServiceInterface companyService;
    private final AuditLogServiceInterface auditLogService;
    private final BillingNotifier billingNotifier;

    @Override
    @Transactional(readOnly = true)
    public RefundQuoteResource quote(String orderCode, Long recruiterId) {
        Order order = requireOwnedOrder(orderCode, recruiterId);
        RefundRequest existing = refundRepository.findByOrderId(order.getId()).orElse(null);
        long refundable = refundableOf(order);

        return RefundQuoteResource.builder()
                .orderCode(order.getCode())
                .orderTotal(order.getTotalAmount())
                .refundableAmount(refundable)
                .requestable(
                        existing == null
                                && REFUNDABLE.contains(order.getStatus())
                                && refundable > 0)
                .existingStatus(existing == null ? null : existing.getStatus())
                .build();
    }

    @Override
    @Transactional
    public RefundRequestResource request(
            String orderCode, CreateRefundRequest request, Long recruiterId) {
        Order order = requireOwnedOrder(orderCode, recruiterId);
        if (!REFUNDABLE.contains(order.getStatus())) {
            throw new AppException(ErrorCode.ORDER_NOT_REFUNDABLE);
        }
        if (refundRepository.findByOrderId(order.getId()).isPresent()) {
            throw new AppException(ErrorCode.REFUND_ALREADY_REQUESTED);
        }
        long refundable = refundableOf(order);
        if (refundable <= 0) {
            throw new AppException(ErrorCode.NOTHING_LEFT_TO_REFUND);
        }

        RefundRequest saved =
                refundRepository.save(
                        RefundRequest.builder()
                                .orderId(order.getId())
                                .companyId(order.getCompanyId())
                                .requestedByRecruiterId(recruiterId)
                                .reason(request.reason().trim())
                                .refundableAmount(refundable)
                                .build());
        order.setStatus(OrderStatus.REFUND_REQUESTED);
        return toResource(saved, order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RefundRequestResource> listMine(Long recruiterId, Pageable pageable) {
        Long companyId = companyResolver.requireId(recruiterId);
        return refundRepository
                .findAllByCompanyIdOrderByCreatedAtDesc(companyId, pageable)
                .map(refund -> toResource(refund, requireOrder(refund.getOrderId())));
    }

    @Override
    @Transactional(readOnly = true)
    public RefundStatusCountsResource summaryForRecruiter(Long recruiterId) {
        Long companyId = companyResolver.requireId(recruiterId);
        Map<RefundStatus, Long> counts = new EnumMap<>(RefundStatus.class);
        for (RefundStatus status : RefundStatus.values()) {
            counts.put(status, 0L);
        }
        long total = 0;
        for (RefundRequestRepository.StatusCount row :
                refundRepository.countByStatusForCompany(companyId)) {
            counts.put(row.getStatus(), row.getTotal());
            total += row.getTotal();
        }
        return new RefundStatusCountsResource(total, counts);
    }

    @Override
    @Transactional(readOnly = true)
    public RefundStatusCountsResource summaryForAdmin() {
        Map<RefundStatus, Long> counts = new EnumMap<>(RefundStatus.class);
        for (RefundStatus status : RefundStatus.values()) {
            counts.put(status, 0L);
        }
        long total = 0;
        for (RefundRequestRepository.StatusCount row : refundRepository.countByStatus()) {
            counts.put(row.getStatus(), row.getTotal());
            total += row.getTotal();
        }
        return new RefundStatusCountsResource(total, counts);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RefundRequestResource> search(
            RefundStatus status, String orderCode, Pageable pageable) {
        if (orderCode != null && !orderCode.isBlank()) {
            return searchByOrderCode(status, orderCode.trim().toUpperCase(), pageable);
        }
        Page<RefundRequest> page =
                status == null
                        ? refundRepository.findAllByOrderByCreatedAtDesc(pageable)
                        : refundRepository.findAllByStatusOrderByCreatedAtDesc(status, pageable);
        Map<Long, Order> ordersByRefundId = new HashMap<>();
        for (RefundRequest refund : page.getContent()) {
            ordersByRefundId.put(refund.getId(), requireOrder(refund.getOrderId()));
        }
        Map<Long, String> names = companyNames(List.copyOf(ordersByRefundId.values()));
        List<RefundRequestResource> items =
                page.getContent().stream()
                        .map(
                                refund ->
                                        toResource(
                                                refund,
                                                ordersByRefundId.get(refund.getId()),
                                                names.get(refund.getCompanyId())))
                        .toList();
        return new PageImpl<>(items, pageable, page.getTotalElements());
    }

    // A refund request is 1:1 with its order, so looking one up by order code is a point lookup,
    // not a text search — at most one row ever matches.
    private Page<RefundRequestResource> searchByOrderCode(
            RefundStatus status, String code, Pageable pageable) {
        Optional<Order> order = orderRepository.findByCode(code);
        if (order.isEmpty()) {
            return Page.empty(pageable);
        }
        List<RefundRequestResource> items =
                refundRepository.findByOrderId(order.get().getId()).stream()
                        .filter(refund -> status == null || refund.getStatus() == status)
                        .map(
                                refund ->
                                        toResource(
                                                refund,
                                                order.get(),
                                                companyNames(List.of(order.get()))
                                                        .get(refund.getCompanyId())))
                        .toList();
        return new PageImpl<>(items, pageable, items.size());
    }

    private Map<Long, String> companyNames(List<Order> orders) {
        Map<Long, String> names = new HashMap<>();
        for (Long companyId :
                orders.stream().map(Order::getCompanyId).collect(Collectors.toSet())) {
            try {
                names.put(companyId, companyService.findSummary(companyId).name());
            } catch (AppException ignored) {
                names.put(companyId, null);
            }
        }
        return names;
    }

    @Override
    @Transactional
    public RefundRequestResource approve(Long id, ReviewRefundRequest request, RequestActor actor) {
        RefundRequest refund = requirePending(id);
        Order order = requireOrder(refund.getOrderId());

        long approved =
                request.approvedAmount() == null
                        ? refund.getRefundableAmount()
                        : request.approvedAmount();
        if (approved > refund.getRefundableAmount()) {
            throw AppException.validation(
                    "approvedAmount", "Cannot refund more than the unused part of the order");
        }

        List<Long> itemIds = itemIdsOf(order);
        entitlementService.revokeUnusedFromOrderItems(itemIds);
        adBookingService.releaseUnconsumed(order.getId());

        refund.setStatus(RefundStatus.APPROVED);
        refund.setApprovedAmount(approved);
        refund.setAdminNote(request.adminNote());
        refund.setReviewedByUserId(actor.userId());
        refund.setReviewedAt(Instant.now());
        order.setStatus(OrderStatus.REFUNDED);

        audit(actor, AuditAction.REFUND_APPROVED, refund, order.getCode() + " · " + approved);
        billingNotifier.refundApproved(order, approved);
        return toResource(refund, order);
    }

    @Override
    @Transactional
    public RefundRequestResource reject(Long id, ReviewRefundRequest request, RequestActor actor) {
        RefundRequest refund = requirePending(id);
        Order order = requireOrder(refund.getOrderId());

        refund.setStatus(RefundStatus.REJECTED);
        refund.setAdminNote(request.adminNote());
        refund.setReviewedByUserId(actor.userId());
        refund.setReviewedAt(Instant.now());
        // The order goes back to what it was so the services stay usable
        order.setStatus(OrderStatus.FULFILLED);

        audit(actor, AuditAction.REFUND_REJECTED, refund, order.getCode());
        billingNotifier.refundRejected(order);
        return toResource(refund, order);
    }

    /**
     * Only the part that was never activated comes back. One line can deliver several benefits, so
     * the line value is shared across its units by count — a benefit carries no price of its own —
     * and the voucher discount is carried across so a discounted order cannot be over-refunded.
     */
    private long refundableOf(Order order) {
        List<OrderItem> items = orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId());
        if (items.isEmpty() || order.getSubtotal() == 0) {
            return 0L;
        }
        Map<Long, OrderItem> byId =
                items.stream().collect(Collectors.toMap(OrderItem::getId, Function.identity()));

        Map<Long, ItemRefundAccumulator> perItem = new HashMap<>();
        for (UnusedUnits unused : entitlementService.unusedFromOrderItems(byId.keySet())) {
            perItem.computeIfAbsent(unused.sourceOrderItemId(), key -> new ItemRefundAccumulator())
                    .add(unused);
        }

        BigDecimal unusedValue = BigDecimal.ZERO;
        for (Map.Entry<Long, ItemRefundAccumulator> entry : perItem.entrySet()) {
            OrderItem item = byId.get(entry.getKey());
            if (item == null) {
                continue;
            }
            BigDecimal ratio = entry.getValue().refundableRatio();
            if (ratio.signum() == 0) {
                continue;
            }
            unusedValue = unusedValue.add(BigDecimal.valueOf(item.getLineTotal()).multiply(ratio));
        }
        if (unusedValue.signum() == 0) {
            return 0L;
        }

        return unusedValue
                .multiply(BigDecimal.valueOf(order.getSubtotalAfterDiscount()))
                .divide(BigDecimal.valueOf(order.getSubtotal()), 0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static final class ItemRefundAccumulator {
        private boolean hasCoreLots;
        private long coreRemaining;
        private long totalRemaining;
        private long totalQuantity;

        void add(UnusedUnits lot) {
            totalQuantity += lot.totalQuantity();
            totalRemaining += lot.remainingQuantity();
            if (!lot.bonus()) {
                hasCoreLots = true;
                coreRemaining += lot.remainingQuantity();
            }
        }

        BigDecimal refundableRatio() {
            if (totalQuantity == 0 || totalRemaining == 0) {
                return BigDecimal.ZERO;
            }
            if (hasCoreLots && coreRemaining == 0) {
                return BigDecimal.ZERO;
            }
            return BigDecimal.valueOf(totalRemaining)
                    .divide(BigDecimal.valueOf(totalQuantity), 6, RoundingMode.HALF_UP);
        }
    }

    private List<Long> itemIdsOf(Order order) {
        return orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId()).stream()
                .map(OrderItem::getId)
                .toList();
    }

    private RefundRequest requirePending(Long id) {
        RefundRequest refund =
                refundRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (refund.getStatus() != RefundStatus.PENDING) {
            throw new AppException(ErrorCode.REFUND_ALREADY_REVIEWED);
        }
        return refund;
    }

    private Order requireOrder(Long orderId) {
        return orderRepository
                .findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private Order requireOwnedOrder(String orderCode, Long recruiterId) {
        Long companyId = companyResolver.requireId(recruiterId);
        Order order =
                orderRepository
                        .findByCode(orderCode.trim().toUpperCase())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!order.getCompanyId().equals(companyId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return order;
    }

    private void audit(
            RequestActor actor, AuditAction action, RefundRequest refund, String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.REFUND_REQUEST)
                        .targetId(refund.getId())
                        .detail(detail)
                        .build());
    }

    private RefundRequestResource toResource(RefundRequest refund, Order order) {
        return toResource(refund, order, null);
    }

    private RefundRequestResource toResource(
            RefundRequest refund, Order order, String companyName) {
        return RefundRequestResource.builder()
                .id(refund.getId())
                .orderCode(order.getCode())
                .companyId(refund.getCompanyId())
                .companyName(companyName)
                .reason(refund.getReason())
                .status(refund.getStatus())
                .orderTotal(order.getTotalAmount())
                .refundableAmount(refund.getRefundableAmount())
                .approvedAmount(refund.getApprovedAmount())
                .adminNote(refund.getAdminNote())
                .reviewedAt(refund.getReviewedAt())
                .createdAt(refund.getCreatedAt())
                .build();
    }
}
