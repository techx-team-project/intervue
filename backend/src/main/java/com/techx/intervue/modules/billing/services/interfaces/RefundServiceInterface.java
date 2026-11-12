package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import com.techx.intervue.modules.billing.requests.CreateRefundRequest;
import com.techx.intervue.modules.billing.requests.ReviewRefundRequest;
import com.techx.intervue.modules.billing.resources.RefundQuoteResource;
import com.techx.intervue.modules.billing.resources.RefundRequestResource;
import com.techx.intervue.modules.billing.resources.RefundStatusCountsResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RefundServiceInterface {

    /** What the order would give back today, so the recruiter sees it before asking. */
    RefundQuoteResource quote(String orderCode, Long recruiterId);

    RefundRequestResource request(String orderCode, CreateRefundRequest request, Long recruiterId);

    Page<RefundRequestResource> listMine(Long recruiterId, Pageable pageable);

    RefundStatusCountsResource summaryForRecruiter(Long recruiterId);

    Page<RefundRequestResource> search(RefundStatus status, Pageable pageable);

    RefundRequestResource approve(Long id, ReviewRefundRequest request, RequestActor actor);

    RefundRequestResource reject(Long id, ReviewRefundRequest request, RequestActor actor);
}
