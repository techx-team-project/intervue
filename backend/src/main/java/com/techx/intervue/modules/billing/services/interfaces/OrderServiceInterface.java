package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.requests.CheckoutRequest;
import com.techx.intervue.modules.billing.resources.OrderResource;
import com.techx.intervue.modules.billing.resources.OrderStatusCountsResource;
import com.techx.intervue.modules.billing.resources.OrderSummaryResource;
import com.techx.intervue.modules.billing.resources.PaymentTransactionResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderServiceInterface {

    OrderResource checkout(CheckoutRequest request, Long recruiterId);

    Page<OrderSummaryResource> search(Pageable pageable, Long recruiterId);

    OrderStatusCountsResource countByStatus(Long recruiterId);

    OrderResource findByCode(String code, Long recruiterId);

    OrderResource cancel(String code, Long recruiterId);

    Page<PaymentTransactionResource> searchPayments(Pageable pageable, Long recruiterId);
}
