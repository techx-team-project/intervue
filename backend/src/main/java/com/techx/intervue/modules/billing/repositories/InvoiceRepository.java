package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.Invoice;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    Page<Invoice> findAllByOrderByIssuedAtDesc(Pageable pageable);
}
