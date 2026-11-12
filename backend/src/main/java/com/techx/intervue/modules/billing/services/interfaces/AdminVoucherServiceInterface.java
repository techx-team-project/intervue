package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import com.techx.intervue.modules.billing.requests.SaveVoucherRequest;
import com.techx.intervue.modules.billing.resources.AdminVoucherResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminVoucherServiceInterface {

    Page<AdminVoucherResource> search(
            String keyword,
            VoucherStatus status,
            VoucherDiscountType discountType,
            Pageable pageable);

    AdminVoucherResource findById(Long id);

    AdminVoucherResource create(SaveVoucherRequest request, RequestActor actor);

    AdminVoucherResource update(Long id, SaveVoucherRequest request, RequestActor actor);

    AdminVoucherResource setStatus(Long id, VoucherStatus status, RequestActor actor);
}
