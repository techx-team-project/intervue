package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.resources.OrderPaymentResource;

public interface OrderPaymentServiceInterface {

    OrderPaymentResource getPayment(String code, Long recruiterId);
}
