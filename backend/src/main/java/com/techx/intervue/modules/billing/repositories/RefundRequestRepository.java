package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.RefundRequest;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {

    Optional<RefundRequest> findByOrderId(Long orderId);

    Page<RefundRequest> findAllByStatusOrderByCreatedAtDesc(RefundStatus status, Pageable pageable);

    Page<RefundRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
