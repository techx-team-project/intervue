package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.RefundRequest;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {

    Optional<RefundRequest> findByOrderId(Long orderId);

    Page<RefundRequest> findAllByStatusOrderByCreatedAtDesc(RefundStatus status, Pageable pageable);

    Page<RefundRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<RefundRequest> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    @Query(
            "SELECT r.status AS status, COUNT(r) AS total FROM RefundRequest r WHERE r.companyId = :companyId GROUP BY r.status")
    List<StatusCount> countByStatusForCompany(@Param("companyId") Long companyId);

    interface StatusCount {
        RefundStatus getStatus();

        long getTotal();
    }
}
