package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.VoucherRedemption;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(
            value =
                    """
                    select redemption, voucher, ord
                      from VoucherRedemption redemption
                      join Voucher voucher on voucher.id = redemption.voucherId
                      join Order ord on ord.id = redemption.orderId
                     where redemption.companyId = :companyId
                       and ord.status not in :excludedStatuses
                     order by redemption.createdAt desc, redemption.id desc
                    """,
            countQuery =
                    """
                    select count(redemption)
                      from VoucherRedemption redemption
                      join Order ord on ord.id = redemption.orderId
                     where redemption.companyId = :companyId
                       and ord.status not in :excludedStatuses
                    """)
    Page<Object[]> findUsedByCompany(
            @Param("companyId") Long companyId,
            @Param("excludedStatuses") Collection<OrderStatus> excludedStatuses,
            Pageable pageable);
}
