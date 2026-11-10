package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.resources.PaymentSyncResultResource;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.PaymentSyncServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentSyncScheduler {

    private final PaymentSyncServiceInterface paymentSyncService;
    private final BillingSettingsServiceInterface billingSettings;

    @Scheduled(cron = "${sepay.sync.cron}", zone = "Asia/Ho_Chi_Minh")
    public void reconcile() {
        if (!Boolean.TRUE.equals(billingSettings.current().getPaymentSyncEnabled())) {
            return;
        }
        PaymentSyncResultResource result = paymentSyncService.sync();
        if (!result.ok()) {
            log.warn("Payment reconciliation skipped: {}", result.message());
            return;
        }
        if (result.created() > 0) {
            log.info(
                    "Payment reconciliation recorded {} transactions, matched {}",
                    result.created(),
                    result.matched());
        }
    }
}
