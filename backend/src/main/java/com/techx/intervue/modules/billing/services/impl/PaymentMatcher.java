package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.clients.SepayTransaction;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.PaymentTransaction;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.PaymentTransactionRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PaymentMatcher {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter SEPAY_MOMENT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final Set<OrderStatus> PAYABLE =
            Set.of(OrderStatus.PENDING_PAYMENT, OrderStatus.UNDERPAID);

    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final OrderFulfillmentService orderFulfillmentService;

    public record MatchOutcome(
            PaymentTransactionStatus status, Order order, boolean orderBecamePaid) {}

    @Transactional
    public MatchOutcome process(SepayTransaction remote, BillingSettings settings) {
        long amountIn = parseAmount(remote.amountIn());
        String code = extractOrderCode(remote.transactionContent(), settings.getOrderCodePrefix());
        Order order =
                code == null
                        ? null
                        : orderRepository
                                .findByCode(code)
                                .filter(found -> PAYABLE.contains(found.getStatus()))
                                .orElse(null);

        PaymentTransaction transaction =
                PaymentTransaction.builder()
                        .sepayId(remote.id())
                        .gateway(remote.bankBrandName())
                        .accountNumber(remote.accountNumber())
                        .content(remote.transactionContent())
                        .amountIn(amountIn)
                        .referenceCode(remote.referenceNumber())
                        .transactionAt(parseMoment(remote.transactionDate()))
                        .status(
                                order == null
                                        ? PaymentTransactionStatus.UNMATCHED
                                        : PaymentTransactionStatus.MATCHED)
                        .matchedOrder(order)
                        .build();

        if (order == null) {
            transactionRepository.save(transaction);
            return new MatchOutcome(PaymentTransactionStatus.UNMATCHED, null, false);
        }

        long paidTotal = order.getPaidAmount() + amountIn;
        order.setPaidAmount(paidTotal);

        boolean becamePaid = paidTotal >= order.getTotalAmount();
        if (becamePaid) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(Instant.now());
            long overpaid = paidTotal - order.getTotalAmount();
            if (overpaid > 0) {
                transaction.setNote("Overpaid by " + overpaid + " " + order.getCurrency());
            }
        } else {
            order.setStatus(OrderStatus.UNDERPAID);
            transaction.setNote(
                    "Short by " + (order.getTotalAmount() - paidTotal) + " " + order.getCurrency());
        }

        transactionRepository.save(transaction);
        if (becamePaid) {
            orderFulfillmentService.fulfil(order);
        }
        return new MatchOutcome(PaymentTransactionStatus.MATCHED, order, becamePaid);
    }

    // Banks change case and inject spaces, so the content is normalised before the code is read
    public String extractOrderCode(String content, String prefix) {
        if (content == null || prefix == null || prefix.isBlank()) {
            return null;
        }
        String normalised = content.toUpperCase(Locale.ROOT).replaceAll("\\s+", "");
        Matcher matcher =
                Pattern.compile(Pattern.quote(prefix.toUpperCase(Locale.ROOT)) + "[A-Z0-9]{8}")
                        .matcher(normalised);
        return matcher.find() ? matcher.group() : null;
    }

    public Instant parseMoment(String value) {
        return Optional.ofNullable(value)
                .map(raw -> LocalDateTime.parse(raw, SEPAY_MOMENT).atZone(VIETNAM).toInstant())
                .orElseGet(Instant::now);
    }

    public long parseAmount(String value) {
        return value == null
                ? 0L
                : new BigDecimal(value).setScale(0, java.math.RoundingMode.DOWN).longValueExact();
    }
}
