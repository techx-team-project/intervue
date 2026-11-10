package com.techx.intervue.modules.billing.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.modules.billing.entities.Invoice;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.repositories.InvoiceRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.services.interfaces.InvoiceServiceInterface;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class InvoiceMailListener {

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;
    private final InvoiceServiceInterface invoiceService;
    private final MailServiceInterface mailService;
    private final AppProperties appProperties;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onInvoiceIssued(InvoiceIssuedEvent event) {
        Invoice invoice = invoiceRepository.findById(event.invoiceId()).orElse(null);
        if (invoice == null
                || invoice.getRecipientEmail() == null
                || invoice.getRecipientEmail().isBlank()) {
            return;
        }
        Order order = orderRepository.findById(invoice.getOrderId()).orElse(null);
        if (order == null) {
            return;
        }

        mailService.sendHtmlWithAttachment(
                invoice.getRecipientEmail(),
                "Hoá đơn đơn hàng " + order.getCode() + " - InterVue",
                "invoice-issued",
                Map.of(
                        "buyerName", invoice.getBuyerName(),
                        "orderCode", order.getCode(),
                        "invoiceNumber", invoice.getNumber(),
                        "totalAmount", money(invoice.getTotalAmount(), invoice.getCurrency()),
                        "orderUrl",
                                appProperties.frontendUrl()
                                        + "/recruiter/orders/"
                                        + order.getCode()),
                invoice.getNumber() + ".pdf",
                invoiceService.renderForAdmin(invoice.getId()),
                "application/pdf");
    }

    private String money(long amount, String currency) {
        return NumberFormat.getInstance(Locale.US).format(amount) + " " + currency;
    }
}
