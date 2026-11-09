package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.config.SepayProperties;
import com.techx.intervue.modules.billing.clients.SepayClientInterface;
import com.techx.intervue.modules.billing.clients.SepayTransaction;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import com.techx.intervue.modules.billing.repositories.PaymentTransactionRepository;
import com.techx.intervue.modules.billing.resources.PaymentSyncResultResource;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.PaymentSyncServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentSyncService implements PaymentSyncServiceInterface {

    private static final int DEFAULT_LIMIT = 100;

    // Guards the cron run against the admin "run now" button inside one JVM.
    // With more than one instance this must become a Redis lock; sepay_id stays the money-safe
    // guard.
    private final AtomicBoolean running = new AtomicBoolean(false);

    private final SepayClientInterface sepayClient;
    private final SepayProperties sepayProperties;
    private final BillingSettingsServiceInterface billingSettings;
    private final PaymentTransactionRepository transactionRepository;
    private final PaymentMatcher paymentMatcher;
    private final BillingNotifier billingNotifier;

    @Override
    public PaymentSyncResultResource sync() {
        if (!running.compareAndSet(false, true)) {
            return result(false, "A reconciliation run is already in progress", 0, 0, 0);
        }
        try {
            return run();
        } catch (Exception cause) {
            log.warn("Payment reconciliation failed", cause);
            return result(false, cause.getMessage(), 0, 0, 0);
        } finally {
            running.set(false);
        }
    }

    private PaymentSyncResultResource run() {
        BillingSettings settings = billingSettings.current();
        if (!sepayClient.isConfigured()
                || settings.getBankAccountNumber() == null
                || settings.getBankAccountNumber().isBlank()) {
            return result(false, "SePay is not configured yet", 0, 0, 0);
        }

        int limit =
                sepayProperties.sync() == null || sepayProperties.sync().limit() == null
                        ? DEFAULT_LIMIT
                        : sepayProperties.sync().limit();

        List<SepayTransaction> remote =
                sepayClient.listTransactions(settings.getBankAccountNumber(), limit).stream()
                        .filter(item -> paymentMatcher.parseAmount(item.amountIn()) > 0)
                        .toList();
        if (remote.isEmpty()) {
            return result(true, "No incoming transactions", 0, 0, 0);
        }

        Set<String> known =
                transactionRepository.findKnownSepayIds(
                        remote.stream().map(SepayTransaction::id).toList());

        // Oldest first so partial payments land on an order in the order they were made
        List<SepayTransaction> fresh =
                remote.stream()
                        .filter(item -> !known.contains(item.id()))
                        .sorted(
                                Comparator.comparing(
                                        item -> paymentMatcher.parseMoment(item.transactionDate())))
                        .toList();

        int created = 0;
        int matched = 0;
        List<PaymentMatcher.MatchOutcome> outcomes = new ArrayList<>();
        for (SepayTransaction item : fresh) {
            try {
                PaymentMatcher.MatchOutcome outcome = paymentMatcher.process(item, settings);
                created++;
                if (outcome.status() == PaymentTransactionStatus.MATCHED) {
                    matched++;
                    outcomes.add(outcome);
                }
            } catch (DataIntegrityViolationException duplicate) {
                log.debug("SePay transaction {} was already recorded", item.id());
            }
        }

        notifyAfterCommit(outcomes);
        return result(true, "Completed", remote.size(), created, matched);
    }

    private void notifyAfterCommit(List<PaymentMatcher.MatchOutcome> outcomes) {
        for (PaymentMatcher.MatchOutcome outcome : outcomes) {
            if (outcome.order() == null) {
                continue;
            }
            if (outcome.orderBecamePaid()) {
                billingNotifier.orderPaid(outcome.order());
            } else {
                billingNotifier.orderUnderpaid(outcome.order());
            }
        }
    }

    private PaymentSyncResultResource result(
            boolean ok, String message, int fetched, int created, int matched) {
        return new PaymentSyncResultResource(Instant.now(), ok, message, fetched, created, matched);
    }
}
