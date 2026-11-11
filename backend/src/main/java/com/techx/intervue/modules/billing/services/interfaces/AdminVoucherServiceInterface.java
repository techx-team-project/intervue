package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.requests.SaveVoucherRequest;
import com.techx.intervue.modules.billing.resources.AdminVoucherResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminVoucherServiceInterface {

    Page<AdminVoucherResource> search(String keyword, Pageable pageable);

    AdminVoucherResource create(SaveVoucherRequest request, RequestActor actor);

    AdminVoucherResource update(Long id, SaveVoucherRequest request, RequestActor actor);
}
