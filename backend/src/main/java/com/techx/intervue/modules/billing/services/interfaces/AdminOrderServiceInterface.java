package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.requests.SearchAdminOrdersRequest;
import com.techx.intervue.modules.billing.resources.AdminOrderResource;
import com.techx.intervue.modules.billing.resources.RevenueReportResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminOrderServiceInterface {

    Page<AdminOrderResource> search(SearchAdminOrdersRequest request, Pageable pageable);

    AdminOrderResource findByCode(String code);

    RevenueReportResource revenue();
}
