package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.Invoice;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.enums.InvoiceType;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.repositories.InvoiceRepository;
import com.techx.intervue.modules.billing.repositories.OrderInvoiceDetailRepository;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.resources.InvoiceResource;
import com.techx.intervue.modules.billing.services.interfaces.InvoiceServiceInterface;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvoiceService implements InvoiceServiceInterface {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final String ANONYMOUS_BUYER = "Khách hàng";

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderInvoiceDetailRepository invoiceDetailRepository;
    private final InvoicePdfRenderer renderer;
    private final RecruiterCompanyResolver companyResolver;

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
        return render(requireInvoice(order), order);
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
        return renderer.render(invoice, items, order.getCode());
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
