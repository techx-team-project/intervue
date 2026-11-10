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

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Page<PaymentTransaction> findAllByStatusOrderByTransactionAtDesc(
            PaymentTransactionStatus status, Pageable pageable);

    Page<PaymentTransaction> findAllByOrderByTransactionAtDesc(Pageable pageable);

    Optional<PaymentTransaction> findBySepayId(String sepayId);

    @Query(
            "select transaction.sepayId from PaymentTransaction transaction where transaction.sepayId in :ids")
    Set<String> findKnownSepayIds(Collection<String> ids);
}
