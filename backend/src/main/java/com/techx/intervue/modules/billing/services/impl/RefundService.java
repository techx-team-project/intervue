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
import com.techx.intervue.modules.billing.entities.CreditPrice;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.entities.RefundRequest;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import com.techx.intervue.modules.billing.repositories.CreditPriceRepository;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.RefundRequestRepository;
import com.techx.intervue.modules.billing.requests.CreateRefundRequest;
import com.techx.intervue.modules.billing.requests.ReviewRefundRequest;
import com.techx.intervue.modules.billing.resources.RefundQuoteResource;
import com.techx.intervue.modules.billing.resources.RefundRequestResource;
import com.techx.intervue.modules.billing.resources.RefundStatusCountsResource;
import com.techx.intervue.modules.billing.services.interfaces.RefundServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
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
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    private final CreditPriceRepository creditPriceRepository;
    private final EntitlementServiceInterface entitlementService;
    private final AdBookingServiceInterface adBookingService;
    private final RecruiterCompanyResolver companyResolver;
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
    public Page<RefundRequestResource> search(RefundStatus status, Pageable pageable) {
        Page<RefundRequest> page =
                status == null
                        ? refundRepository.findAllByOrderByCreatedAtDesc(pageable)
                        : refundRepository.findAllByStatusOrderByCreatedAtDesc(status, pageable);
        return page.map(refund -> toResource(refund, requireOrder(refund.getOrderId())));
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
        Map<String, Integer> unitWeights = loadUnitWeights();

        Map<Long, ItemRefundAccumulator> perItem = new HashMap<>();
        for (UnusedUnits unused : entitlementService.unusedFromOrderItems(byId.keySet())) {
            long weight = weightOf(unused.type(), unused.tier(), unitWeights);
            perItem.computeIfAbsent(unused.sourceOrderItemId(), key -> new ItemRefundAccumulator())
                    .add(unused, weight);
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

    private Map<String, Integer> loadUnitWeights() {
        Map<String, Integer> weights = new HashMap<>();
        for (CreditPrice price : creditPriceRepository.findAll()) {
            weights.put(
                    weightKey(price.getEntitlementType(), price.getTier()), price.getCreditCost());
        }
        return weights;
    }

    private static long weightOf(EntitlementType type, int tier, Map<String, Integer> unitWeights) {
        if (type == EntitlementType.CREDIT) {
            return 1L;
        }
        Integer weight = unitWeights.get(weightKey(type, tier));
        if (weight == null && tier != 1) {
            weight = unitWeights.get(weightKey(type, 1));
        }
        return weight != null && weight > 0 ? weight : 1L;
    }

    private static String weightKey(EntitlementType type, int tier) {
        return type.name() + ":" + tier;
    }

    private static final class ItemRefundAccumulator {
        private boolean hasCoreLots;
        private long coreWeightedRemaining;
        private long totalWeightedRemaining;
        private long totalWeightedQuantity;

        void add(UnusedUnits lot, long weight) {
            long weightedTotal = (long) lot.totalQuantity() * weight;
            long weightedRem = (long) lot.remainingQuantity() * weight;
            totalWeightedQuantity += weightedTotal;
            totalWeightedRemaining += weightedRem;
            if (!lot.bonus()) {
                hasCoreLots = true;
                coreWeightedRemaining += weightedRem;
            }
        }

        BigDecimal refundableRatio() {
            if (totalWeightedQuantity == 0 || totalWeightedRemaining == 0) {
                return BigDecimal.ZERO;
            }
            if (hasCoreLots && coreWeightedRemaining == 0) {
                return BigDecimal.ZERO;
            }
            return BigDecimal.valueOf(totalWeightedRemaining)
                    .divide(BigDecimal.valueOf(totalWeightedQuantity), 6, RoundingMode.HALF_UP);
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
        return RefundRequestResource.builder()
                .id(refund.getId())
                .orderCode(order.getCode())
                .companyId(refund.getCompanyId())
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
