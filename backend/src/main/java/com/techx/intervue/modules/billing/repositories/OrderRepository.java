package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository
        extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    Optional<Order> findByCodeAndCompanyId(String code, Long companyId);

    Optional<Order> findByCode(String code);

    Page<Order> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    long countByCompanyIdAndStatus(Long companyId, OrderStatus status);

    List<Order> findAllByStatusInAndExpiresAtBefore(
            Collection<OrderStatus> statuses, Instant moment);

    Optional<Order> findFirstByPurchasedByRecruiterIdAndStatusAndTotalAmountAndCreatedAtAfter(
            Long recruiterId, OrderStatus status, Long totalAmount, Instant createdAfter);

    boolean existsByCode(String code);

    @Query(
            "SELECT o.status AS status, COUNT(o) AS total FROM Order o WHERE o.companyId = :companyId GROUP BY o.status")
    List<StatusCount> countByStatusForCompany(@Param("companyId") Long companyId);

    interface StatusCount {
        OrderStatus getStatus();

        long getTotal();
    }
}
