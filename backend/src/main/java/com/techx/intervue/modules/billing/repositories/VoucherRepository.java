package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.Voucher;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherRepository
        extends JpaRepository<Voucher, Long>, JpaSpecificationExecutor<Voucher> {

    Optional<Voucher> findByCode(String code);

    boolean existsByCode(String code);

    // Single atomic statement: two checkouts racing for the last redemption cannot both win.
    // No clearAutomatically: the voucher is never edited in memory, and clearing would detach the
    // order being built in the same transaction.
    @Modifying(flushAutomatically = true)
    @Query(
            """
            update Voucher voucher
               set voucher.usedCount = voucher.usedCount + 1
             where voucher.id = :id
               and (voucher.usageLimit is null or voucher.usedCount < voucher.usageLimit)
            """)
    int claim(@Param("id") Long id);

    @Modifying(flushAutomatically = true)
    @Query(
            """
            update Voucher voucher
               set voucher.usedCount = voucher.usedCount - 1
             where voucher.id = :id
               and voucher.usedCount > 0
            """)
    int release(@Param("id") Long id);
}
