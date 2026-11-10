package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderInvoiceDetailRepository extends JpaRepository<OrderInvoiceDetail, Long> {

    Optional<OrderInvoiceDetail> findByOrderId(Long orderId);
}
