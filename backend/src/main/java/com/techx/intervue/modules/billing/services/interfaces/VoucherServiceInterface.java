package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.requests.ValidateVoucherRequest;
import com.techx.intervue.modules.billing.resources.VoucherPreviewResource;

public interface VoucherServiceInterface {

    /** The one place the discount rules live, used by both the preview and the checkout. */
    record AppliedVoucher(Voucher voucher, long discountAmount) {}

    VoucherPreviewResource validate(ValidateVoucherRequest request, Long recruiterId);

    AppliedVoucher apply(String code, long subtotal, Long companyId);

    void claim(AppliedVoucher applied, Long orderId, Long companyId);

    void release(Long orderId);
}
