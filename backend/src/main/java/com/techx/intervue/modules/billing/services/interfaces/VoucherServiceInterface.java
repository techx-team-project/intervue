package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.requests.ValidateVoucherRequest;
import com.techx.intervue.modules.billing.resources.AvailableVoucherResource;
import com.techx.intervue.modules.billing.resources.UsedVoucherResource;
import com.techx.intervue.modules.billing.resources.VoucherPreviewResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VoucherServiceInterface {

    /** The one place the discount rules live, used by both the preview and the checkout. */
    record AppliedVoucher(Voucher voucher, long discountAmount) {}

    record BillableLine(Long packageId, long subtotal) {}

    List<AvailableVoucherResource> listAvailable(Long recruiterId, Long packageId);

    Page<AvailableVoucherResource> listAvailableWallet(Long recruiterId, Pageable pageable);

    Page<UsedVoucherResource> listUsedWallet(Long recruiterId, Pageable pageable);

    VoucherPreviewResource validate(ValidateVoucherRequest request, Long recruiterId);

    AppliedVoucher previewForCheckout(String code, List<BillableLine> lines);

    void assertUsableForCompany(Voucher voucher, Long companyId);

    AppliedVoucher apply(String code, List<BillableLine> lines, Long companyId);

    void claim(AppliedVoucher applied, Long orderId, Long companyId);

    void release(Long orderId);
}
