package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderExpiryScheduler {

    private final OrderRepository orderRepository;
    private final VoucherServiceInterface voucherService;
    private final AdBookingServiceInterface adBookingService;

    @Scheduled(cron = "0 */10 * * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void expireOverdueOrders() {
        List<Order> overdue =
                orderRepository.findAllByStatusAndExpiresAtBefore(
                        OrderStatus.PENDING_PAYMENT, Instant.now());
        if (overdue.isEmpty()) {
            return;
        }
        overdue.forEach(
                order -> {
                    order.setStatus(OrderStatus.EXPIRED);
                    voucherService.release(order.getId());
                    adBookingService.release(order.getId());
                });
        log.info("Expired {} unpaid orders", overdue.size());
    }
}
