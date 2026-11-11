package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.requests.ValidateVoucherRequest;
import com.techx.intervue.modules.billing.resources.AvailableVoucherResource;
import com.techx.intervue.modules.billing.resources.VoucherPreviewResource;
import java.util.List;

public interface VoucherServiceInterface {

    /** The one place the discount rules live, used by both the preview and the checkout. */
    record AppliedVoucher(Voucher voucher, long discountAmount) {}

    List<AvailableVoucherResource> listAvailable(Long recruiterId);

    VoucherPreviewResource validate(ValidateVoucherRequest request, Long recruiterId);

    AppliedVoucher apply(String code, long subtotal, Long companyId);

    void claim(AppliedVoucher applied, Long orderId, Long companyId);

    void release(Long orderId);
}
