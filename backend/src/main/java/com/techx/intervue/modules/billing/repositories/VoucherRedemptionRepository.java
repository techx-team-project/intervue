package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.VoucherRedemption;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherRedemptionRepository extends JpaRepository<VoucherRedemption, Long> {

    Optional<VoucherRedemption> findByOrderId(Long orderId);

    long countByVoucherIdAndCompanyId(Long voucherId, Long companyId);

    @Query(
            """
            select redemption.voucherId, count(redemption)
              from VoucherRedemption redemption
             where redemption.companyId = :companyId
               and redemption.voucherId in :voucherIds
             group by redemption.voucherId
            """)
    List<Object[]> countByCompanyGrouped(
            @Param("companyId") Long companyId, @Param("voucherIds") Collection<Long> voucherIds);
}
