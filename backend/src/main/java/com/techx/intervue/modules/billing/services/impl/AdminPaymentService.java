package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.config.SepayProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.PaymentTransaction;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import com.techx.intervue.modules.billing.repositories.BillingSettingsRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.PaymentTransactionRepository;
import com.techx.intervue.modules.billing.requests.MatchPaymentTransactionRequest;
import com.techx.intervue.modules.billing.requests.SaveBillingSettingsRequest;
import com.techx.intervue.modules.billing.resources.BillingSettingsResource;
import com.techx.intervue.modules.billing.resources.PaymentTransactionResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminPaymentServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import java.time.Instant;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminPaymentService implements AdminPaymentServiceInterface {

    private static final Set<OrderStatus> PAYABLE =
            Set.of(OrderStatus.PENDING_PAYMENT, OrderStatus.UNDERPAID);

    private final BillingSettingsRepository settingsRepository;
    private final BillingSettingsServiceInterface billingSettings;
    private final PaymentTransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    private final BillingNotifier billingNotifier;
    private final OrderFulfillmentService orderFulfillmentService;
    private final AuditLogServiceInterface auditLogService;
    private final SepayProperties sepayProperties;

    @Override
    @Transactional(readOnly = true)
    public BillingSettingsResource getSettings() {
        return toResource(billingSettings.current());
    }

    @Override
    @Transactional
    public BillingSettingsResource updateSettings(
            SaveBillingSettingsRequest request, RequestActor actor) {
        BillingSettings settings =
                settingsRepository
                        .findFirstByOrderByIdAsc()
                        .orElseThrow(() -> new AppException(ErrorCode.BILLING_NOT_CONFIGURED));
        settings.setVatRate(request.vatRate());
        settings.setOrderExpireHours(request.orderExpireHours());
        settings.setOrderCodePrefix(request.orderCodePrefix().trim().toUpperCase());
        settings.setMaxPendingOrders(request.maxPendingOrders());
        settings.setBankCode(trimToNull(request.bankCode()));
        settings.setBankAccountNumber(trimToNull(request.bankAccountNumber()));
        settings.setBankAccountName(trimToNull(request.bankAccountName()));
        settings.setPaymentSyncEnabled(request.paymentSyncEnabled());

        audit(
                actor,
                AuditAction.BILLING_SETTINGS_UPDATED,
                AuditTargetType.BILLING_SETTINGS,
                settings.getId(),
                "VAT " + settings.getVatRate());
        return toResource(settings);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentTransactionResource> searchTransactions(
            PaymentTransactionStatus status, Pageable pageable) {
        Page<PaymentTransaction> page =
                status == null
                        ? transactionRepository.findAllByOrderByTransactionAtDesc(pageable)
                        : transactionRepository.findAllByStatusOrderByTransactionAtDesc(
                                status, pageable);
        return page.map(this::toResource);
    }

    @Override
    @Transactional
    public PaymentTransactionResource matchTransaction(
            Long id, MatchPaymentTransactionRequest request, RequestActor actor) {
        PaymentTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (transaction.getStatus() == PaymentTransactionStatus.MATCHED) {
            throw new AppException(ErrorCode.TRANSACTION_ALREADY_MATCHED);
        }

        Order order =
                orderRepository
                        .findByCode(request.orderCode().trim().toUpperCase())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!PAYABLE.contains(order.getStatus())) {
            throw new AppException(ErrorCode.ORDER_NOT_PAYABLE);
        }

        long paidTotal = order.getPaidAmount() + transaction.getAmountIn();
        order.setPaidAmount(paidTotal);
        boolean becamePaid = paidTotal >= order.getTotalAmount();
        if (becamePaid) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(Instant.now());
        } else {
            order.setStatus(OrderStatus.UNDERPAID);
        }

        transaction.setStatus(PaymentTransactionStatus.MATCHED);
        transaction.setMatchedOrder(order);
        transaction.setMatchedByAdminId(actor.userId());
        transaction.setNote(trimToNull(request.note()));

        audit(
                actor,
                AuditAction.PAYMENT_TRANSACTION_MATCHED,
                AuditTargetType.PAYMENT_TRANSACTION,
                transaction.getId(),
                order.getCode());

        if (becamePaid) {
            orderFulfillmentService.fulfil(order);
            billingNotifier.orderPaid(order);
        } else {
            billingNotifier.orderUnderpaid(order);
        }
        return toResource(transaction);
    }

    private BillingSettingsResource toResource(BillingSettings settings) {
        return new BillingSettingsResource(
                settings.getVatRate(),
                settings.getOrderExpireHours(),
                settings.getOrderCodePrefix(),
                settings.getMaxPendingOrders(),
                settings.getBankCode(),
                settings.getBankAccountNumber(),
                settings.getBankAccountName(),
                settings.getPaymentSyncEnabled(),
                sepayProperties.apiToken() != null && !sepayProperties.apiToken().isBlank());
    }

    private PaymentTransactionResource toResource(PaymentTransaction transaction) {
        return new PaymentTransactionResource(
                transaction.getId(),
                transaction.getSepayId(),
                transaction.getGateway(),
                transaction.getAccountNumber(),
                transaction.getContent(),
                transaction.getAmountIn(),
                transaction.getReferenceCode(),
                transaction.getTransactionAt(),
                transaction.getStatus(),
                transaction.getMatchedOrder() == null
                        ? null
                        : transaction.getMatchedOrder().getCode(),
                transaction.getNote());
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void audit(
            RequestActor actor,
            AuditAction action,
            AuditTargetType targetType,
            Long targetId,
            String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(targetType)
                        .targetId(targetId)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }
}
