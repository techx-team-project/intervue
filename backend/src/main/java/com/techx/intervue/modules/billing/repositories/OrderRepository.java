package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByCodeAndCompanyId(String code, Long companyId);

    Optional<Order> findByCode(String code);

    Page<Order> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    long countByCompanyIdAndStatus(Long companyId, OrderStatus status);

    List<Order> findAllByStatusAndExpiresAtBefore(OrderStatus status, Instant moment);

    Optional<Order> findFirstByPurchasedByRecruiterIdAndStatusAndTotalAmountAndCreatedAtAfter(
            Long recruiterId, OrderStatus status, Long totalAmount, Instant createdAfter);

    boolean existsByCode(String code);
}
