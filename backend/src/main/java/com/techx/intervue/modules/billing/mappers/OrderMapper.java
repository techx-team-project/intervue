package com.techx.intervue.modules.billing.mappers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.resources.OrderInvoiceDetailResource;
import com.techx.intervue.modules.billing.resources.OrderItemResource;
import com.techx.intervue.modules.billing.resources.OrderResource;
import com.techx.intervue.modules.billing.resources.OrderSummaryResource;
import com.techx.intervue.modules.billing.resources.ServicePackageBenefitResource;
import com.techx.intervue.modules.billing.services.impl.AdCartMeta;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderMapper {

    private static final TypeReference<List<ServicePackageBenefitResource>> BENEFIT_LIST =
            new TypeReference<>() {};

    private final ObjectMapper objectMapper;
    private final AdCartMeta adCartMeta;

    public String writeBenefits(List<ServicePackageBenefitResource> benefits) {
        try {
            return objectMapper.writeValueAsString(benefits);
        } catch (Exception cause) {
            log.warn("Could not serialise package benefits", cause);
            return null;
        }
    }

    public OrderItemResource toItemResource(OrderItem item) {
        return new OrderItemResource(
                item.getId(),
                item.getServicePackage() == null ? null : item.getServicePackage().getId(),
                item.getPackageName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal(),
                item.getValidityDays(),
                item.getBonusCredits(),
                readBenefits(item.getBenefitsJson()),
                adCartMeta.readWeeks(item.getMetaJson()));
    }

    public OrderInvoiceDetailResource toInvoiceResource(OrderInvoiceDetail detail) {
        if (detail == null) {
            return null;
        }
        return new OrderInvoiceDetailResource(
                detail.getInvoiceType(),
                detail.getTaxId(),
                detail.getCompanyName(),
                detail.getCompanyAddress(),
                detail.getFullName(),
                detail.getIdentityNumber(),
                detail.getPersonalAddress(),
                detail.getRecipientEmail());
    }

    public OrderResource toResource(
            Order order, List<OrderItem> items, OrderInvoiceDetail invoiceDetail) {
        return new OrderResource(
                order.getId(),
                order.getCode(),
                order.getStatus(),
                order.getSubtotal(),
                order.getDiscountAmount(),
                order.getSubtotalAfterDiscount(),
                order.getVatRate(),
                order.getVatAmount(),
                order.getTotalAmount(),
                order.getPaidAmount(),
                order.getCurrency(),
                order.getExpiresAt(),
                order.getPaidAt(),
                order.getCancelledAt(),
                order.getCreatedAt(),
                items.stream().map(this::toItemResource).toList(),
                toInvoiceResource(invoiceDetail));
    }

    public OrderSummaryResource toSummaryResource(Order order, int itemCount) {
        return new OrderSummaryResource(
                order.getId(),
                order.getCode(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCurrency(),
                itemCount,
                order.getExpiresAt(),
                order.getCreatedAt());
    }

    public List<ServicePackageBenefitResource> readBenefits(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, BENEFIT_LIST);
        } catch (Exception cause) {
            log.warn("Could not read stored package benefits", cause);
            return List.of();
        }
    }
}
