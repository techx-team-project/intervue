package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.resources.InvoiceResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InvoiceServiceInterface {

    /** Issues the document for a paid order; doing it twice is a no-op. */
    void issueFor(Order order);

    InvoiceResource findForOrder(String orderCode, Long recruiterId);

    byte[] renderForRecruiter(String orderCode, Long recruiterId);

    Page<InvoiceResource> search(Pageable pageable);

    byte[] renderForAdmin(Long invoiceId);
}
