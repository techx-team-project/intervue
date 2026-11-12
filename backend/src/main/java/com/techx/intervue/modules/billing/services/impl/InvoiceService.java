package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.Invoice;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.enums.InvoiceType;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.events.InvoiceIssuedEvent;
import com.techx.intervue.modules.billing.repositories.InvoiceRepository;
import com.techx.intervue.modules.billing.repositories.OrderInvoiceDetailRepository;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.resources.InvoiceResource;
import com.techx.intervue.modules.billing.services.interfaces.InvoiceServiceInterface;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvoiceService implements InvoiceServiceInterface {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final String ANONYMOUS_BUYER = "Customer";
    private static final String INVOICE_NOTICE =
            "Internal record only. This is not an electronic invoice carrying a tax authority code.";
    private static final float[] STATUS_AMBER = {0.78f, 0.45f, 0.02f};
    private static final float[] STATUS_NEUTRAL = {0.45f, 0.45f, 0.47f};

    // A recruiter may need this to prove the order to their finance team before being funded to
    // pay, or to keep for their own records after the order was cancelled unpaid
    private static final Set<OrderStatus> PRE_PAYMENT_DOCUMENT_STATUSES =
            Set.of(OrderStatus.PENDING_PAYMENT, OrderStatus.UNDERPAID, OrderStatus.CANCELLED);

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderInvoiceDetailRepository invoiceDetailRepository;
    private final InvoicePdfRenderer renderer;
    private final RecruiterCompanyResolver companyResolver;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public void issueFor(Order order) {
        if (invoiceRepository.existsByOrderId(order.getId())) {
            return;
        }
        OrderInvoiceDetail detail =
                invoiceDetailRepository.findByOrderId(order.getId()).orElse(null);
        Instant issuedAt = order.getPaidAt() == null ? Instant.now() : order.getPaidAt();

        Invoice invoice =
                invoiceRepository.save(
                        Invoice.builder()
                                .orderId(order.getId())
                                .number("TEMP-" + order.getId())
                                .issuedAt(issuedAt)
                                .invoiceType(
                                        detail == null
                                                ? InvoiceType.PERSONAL
                                                : detail.getInvoiceType())
                                .buyerName(buyerName(detail))
                                .buyerTaxId(detail == null ? null : detail.getTaxId())
                                .buyerAddress(buyerAddress(detail))
                                .recipientEmail(detail == null ? "" : detail.getRecipientEmail())
                                .subtotal(order.getSubtotal())
                                .discountAmount(order.getDiscountAmount())
                                .vatRate(order.getVatRate())
                                .vatAmount(order.getVatAmount())
                                .totalAmount(order.getTotalAmount())
                                .currency(order.getCurrency())
                                .build());

        // Derived from the key so two issues can never collide; a gap only means a rolled-back
        // order
        invoice.setNumber(
                "INV-%d-%06d".formatted(issuedAt.atZone(VIETNAM).getYear(), invoice.getId()));
        invoiceRepository.save(invoice);
        eventPublisher.publishEvent(new InvoiceIssuedEvent(invoice.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResource findForOrder(String orderCode, Long recruiterId) {
        Order order = requireOwnedOrder(orderCode, recruiterId);
        return toResource(requireInvoice(order), order.getCode());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] renderForRecruiter(String orderCode, Long recruiterId) {
        Order order = requireOwnedOrder(orderCode, recruiterId);
        return invoiceRepository
                .findByOrderId(order.getId())
                .map(invoice -> render(invoice, order))
                .orElseGet(() -> renderPrePaymentDocument(order));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResource> search(Pageable pageable) {
        Page<Invoice> page = invoiceRepository.findAllByOrderByIssuedAtDesc(pageable);
        return page.map(invoice -> toResource(invoice, orderCodeOf(invoice)));
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] renderForAdmin(Long invoiceId) {
        Invoice invoice =
                invoiceRepository
                        .findById(invoiceId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Order order =
                orderRepository
                        .findById(invoice.getOrderId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return render(invoice, order);
    }

    private byte[] render(Invoice invoice, Order order) {
        List<OrderItem> items = orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId());
        return renderer.render(toDocumentView(invoice, order.getCode()), items);
    }

    private byte[] renderPrePaymentDocument(Order order) {
        if (!PRE_PAYMENT_DOCUMENT_STATUSES.contains(order.getStatus())) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        OrderInvoiceDetail detail =
                invoiceDetailRepository.findByOrderId(order.getId()).orElse(null);
        List<OrderItem> items = orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId());
        return renderer.render(toPrePaymentDocumentView(order, detail), items);
    }

    private OrderDocumentView toDocumentView(Invoice invoice, String orderCode) {
        return new OrderDocumentView(
                "INVOICE",
                invoice.getNumber(),
                null,
                null,
                orderCode,
                invoice.getIssuedAt(),
                invoice.getBuyerName(),
                invoice.getBuyerTaxId(),
                invoice.getBuyerAddress(),
                invoice.getRecipientEmail(),
                invoice.getSubtotal(),
                invoice.getDiscountAmount(),
                invoice.getVatRate(),
                invoice.getVatAmount(),
                invoice.getTotalAmount(),
                invoice.getCurrency(),
                "Total paid",
                INVOICE_NOTICE);
    }

    private OrderDocumentView toPrePaymentDocumentView(Order order, OrderInvoiceDetail detail) {
        boolean cancelled = order.getStatus() == OrderStatus.CANCELLED;
        String statusLabel =
                cancelled
                        ? "CANCELLED"
                        : order.getStatus() == OrderStatus.UNDERPAID
                                ? "UNDERPAID"
                                : "AWAITING PAYMENT";
        String notice =
                cancelled
                        ? "This order was cancelled before payment was completed. For internal reference only — not a valid VAT invoice."
                        : "This order has not been paid yet. For internal reference only — not a valid VAT invoice.";

        return new OrderDocumentView(
                "ORDER CONFIRMATION",
                null,
                statusLabel,
                cancelled ? STATUS_NEUTRAL : STATUS_AMBER,
                order.getCode(),
                Instant.now(),
                buyerName(detail),
                detail == null ? null : detail.getTaxId(),
                buyerAddress(detail),
                detail == null ? "" : detail.getRecipientEmail(),
                order.getSubtotal(),
                order.getDiscountAmount(),
                order.getVatRate(),
                order.getVatAmount(),
                order.getTotalAmount(),
                order.getCurrency(),
                cancelled ? "Total (not paid)" : "Total due",
                notice);
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

    private Invoice requireInvoice(Order order) {
        return invoiceRepository
                .findByOrderId(order.getId())
                .orElseThrow(
                        () ->
                                new AppException(
                                        order.getStatus() == OrderStatus.PENDING_PAYMENT
                                                        || order.getStatus()
                                                                == OrderStatus.UNDERPAID
                                                ? ErrorCode.INVOICE_NOT_ISSUED_YET
                                                : ErrorCode.NOT_FOUND));
    }

    private String orderCodeOf(Invoice invoice) {
        return orderRepository.findById(invoice.getOrderId()).map(Order::getCode).orElse("");
    }

    private String buyerName(OrderInvoiceDetail detail) {
        if (detail == null) {
            return ANONYMOUS_BUYER;
        }
        String name =
                detail.getInvoiceType() == InvoiceType.BUSINESS
                        ? detail.getCompanyName()
                        : detail.getFullName();
        return name == null || name.isBlank() ? ANONYMOUS_BUYER : name;
    }

    private String buyerAddress(OrderInvoiceDetail detail) {
        if (detail == null) {
            return null;
        }
        return detail.getInvoiceType() == InvoiceType.BUSINESS
                ? detail.getCompanyAddress()
                : detail.getPersonalAddress();
    }

    private InvoiceResource toResource(Invoice invoice, String orderCode) {
        return InvoiceResource.builder()
                .id(invoice.getId())
                .number(invoice.getNumber())
                .orderCode(orderCode)
                .issuedAt(invoice.getIssuedAt())
                .invoiceType(invoice.getInvoiceType())
                .buyerName(invoice.getBuyerName())
                .buyerTaxId(invoice.getBuyerTaxId())
                .recipientEmail(invoice.getRecipientEmail())
                .subtotal(invoice.getSubtotal())
                .discountAmount(invoice.getDiscountAmount())
                .vatRate(invoice.getVatRate())
                .vatAmount(invoice.getVatAmount())
                .totalAmount(invoice.getTotalAmount())
                .currency(invoice.getCurrency())
                .build();
    }
}
