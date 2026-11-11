package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderExpiryScheduler {

    private static final Set<OrderStatus> EXPIRABLE =
            Set.of(OrderStatus.PENDING_PAYMENT, OrderStatus.UNDERPAID);

    private final OrderRepository orderRepository;
    private final VoucherServiceInterface voucherService;
    private final AdBookingServiceInterface adBookingService;
    private final BillingNotifier billingNotifier;

    @Scheduled(cron = "0 */10 * * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void expireOverdueOrders() {
        List<Order> overdue =
                orderRepository.findAllByStatusInAndExpiresAtBefore(EXPIRABLE, Instant.now());
        if (overdue.isEmpty()) {
            return;
        }
        int withUnrefundedPayment = 0;
        for (Order order : overdue) {
            boolean hadPayment = order.getPaidAmount() > 0;
            order.setStatus(OrderStatus.EXPIRED);
            voucherService.release(order.getId());
            adBookingService.release(order.getId());
            if (hadPayment) {
                withUnrefundedPayment++;
                billingNotifier.orderExpiredUnderpaid(order);
                billingNotifier.orderExpiredNeedsManualRefund(order);
            }
        }
        log.info(
                "Expired {} unpaid orders ({} had a partial payment needing a manual refund)",
                overdue.size(),
                withUnrefundedPayment);
    }
}
