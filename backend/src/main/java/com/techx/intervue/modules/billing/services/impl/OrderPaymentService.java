package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.config.SepayProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.resources.OrderPaymentResource;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.OrderPaymentServiceInterface;
import com.techx.intervue.modules.company.resources.CompanyResource;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderPaymentService implements OrderPaymentServiceInterface {

    private final OrderRepository orderRepository;
    private final BillingSettingsServiceInterface billingSettings;
    private final RecruiterCompanyResolver companyResolver;
    private final SepayProperties sepayProperties;

    @Override
    @Transactional(readOnly = true)
    public OrderPaymentResource getPayment(String code, Long recruiterId) {
        CompanyResource company = companyResolver.require(recruiterId);
        Order order =
                orderRepository
                        .findByCodeAndCompanyId(code, company.id())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        BillingSettings settings = billingSettings.current();
        boolean configured =
                isFilled(settings.getBankAccountNumber()) && isFilled(settings.getBankCode());

        return new OrderPaymentResource(
                order.getCode(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getPaidAmount(),
                order.getCurrency(),
                order.getExpiresAt(),
                configured,
                configured ? settings.getBankCode() : null,
                configured ? settings.getBankAccountNumber() : null,
                configured ? settings.getBankAccountName() : null,
                order.getCode(),
                configured ? qrUrl(settings, order) : null);
    }

    private String qrUrl(BillingSettings settings, Order order) {
        long remaining = Math.max(0, order.getTotalAmount() - order.getPaidAmount());
        return sepayProperties.qrBaseUrl()
                + "/img?acc="
                + encode(settings.getBankAccountNumber())
                + "&bank="
                + encode(settings.getBankCode())
                + "&amount="
                + remaining
                + "&des="
                + encode(order.getCode());
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private boolean isFilled(String value) {
        return value != null && !value.isBlank();
    }
}
