package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.PaymentTransaction;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Page<PaymentTransaction> findAllByStatusOrderByTransactionAtDesc(
            PaymentTransactionStatus status, Pageable pageable);

    Page<PaymentTransaction> findAllByOrderByTransactionAtDesc(Pageable pageable);

    Page<PaymentTransaction> findAllByMatchedOrder_CompanyIdOrderByTransactionAtDesc(
            Long companyId, Pageable pageable);

    long countByMatchedOrder_CompanyId(Long companyId);

    @Query(
            "select coalesce(sum(transaction.amountIn), 0) from PaymentTransaction transaction"
                    + " where transaction.matchedOrder.companyId = :companyId")
    long sumAmountInByMatchedOrder_CompanyId(@Param("companyId") Long companyId);

    Optional<PaymentTransaction> findBySepayId(String sepayId);

    @Query(
            "select transaction.sepayId from PaymentTransaction transaction where transaction.sepayId in :ids")
    Set<String> findKnownSepayIds(Collection<String> ids);
}
