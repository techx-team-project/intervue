package com.techx.intervue.modules.billing.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import com.techx.intervue.modules.billing.enums.InvoiceType;
import com.techx.intervue.modules.billing.repositories.OrderInvoiceDetailRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.services.interfaces.InvoiceServiceInterface;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderCreatedMailListener {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter EXPIRES_AT =
            DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy").withZone(VIETNAM);
    private static final String ANONYMOUS_BUYER = "Customer";

    private final OrderRepository orderRepository;
    private final OrderInvoiceDetailRepository invoiceDetailRepository;
    private final InvoiceServiceInterface invoiceService;
    private final MailServiceInterface mailService;
    private final AppProperties appProperties;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onOrderCreated(OrderCreatedEvent event) {
        Order order = orderRepository.findById(event.orderId()).orElse(null);
        if (order == null) {
            log.warn("Order {} not found, skipping order-created email", event.orderId());
            return;
        }
        OrderInvoiceDetail detail =
                invoiceDetailRepository.findByOrderId(order.getId()).orElse(null);
        if (detail == null
                || detail.getRecipientEmail() == null
                || detail.getRecipientEmail().isBlank()) {
            log.warn(
                    "Order {} has no invoice recipient email, skipping order-created email",
                    order.getCode());
            return;
        }

        log.info(
                "Sending order-created email for order {} to {}",
                order.getCode(),
                detail.getRecipientEmail());
        mailService.sendHtmlWithAttachment(
                detail.getRecipientEmail(),
                "Order " + order.getCode() + " placed - awaiting payment - InterVue",
                "order-created",
                Map.of(
                        "buyerName", buyerName(detail),
                        "orderCode", order.getCode(),
                        "totalAmount", money(order.getTotalAmount(), order.getCurrency()),
                        "expiresAt", EXPIRES_AT.format(order.getExpiresAt()),
                        "orderUrl",
                                appProperties.frontendUrl()
                                        + "/recruiter/orders/"
                                        + order.getCode()),
                order.getCode() + ".pdf",
                invoiceService.renderDocument(order),
                "application/pdf");
    }

    private String buyerName(OrderInvoiceDetail detail) {
        String name =
                detail.getInvoiceType() == InvoiceType.BUSINESS
                        ? detail.getCompanyName()
                        : detail.getFullName();
        return name == null || name.isBlank() ? ANONYMOUS_BUYER : name;
    }

    private String money(long amount, String currency) {
        return NumberFormat.getInstance(Locale.US).format(amount) + " " + currency;
    }
}
