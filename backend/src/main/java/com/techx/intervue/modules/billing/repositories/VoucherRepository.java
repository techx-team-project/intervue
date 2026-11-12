package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherRepository
        extends JpaRepository<Voucher, Long>, JpaSpecificationExecutor<Voucher> {

    Optional<Voucher> findByCode(String code);

    @Query(
            "select voucher from Voucher voucher left join fetch voucher.applicablePackages where voucher.id = :id")
    Optional<Voucher> findByIdWithPackages(@Param("id") Long id);

    @Query(
            "select voucher from Voucher voucher left join fetch voucher.applicablePackages where voucher.code = :code")
    Optional<Voucher> findByCodeWithPackages(@Param("code") String code);

    boolean existsByCode(String code);

    @Query(
            """
            select voucher
              from Voucher voucher
             where voucher.status = :status
               and (voucher.startsAt is null or voucher.startsAt <= :now)
               and (voucher.endsAt is null or voucher.endsAt > :now)
               and (voucher.usageLimit is null or voucher.usedCount < voucher.usageLimit)
             order by case when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.EMERALD then 0
                           when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.AMBER then 1
                           when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.ROSE then 2
                           when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.BLUE then 3
                           else 4
                      end asc,
                      case when voucher.endsAt is null then 1 else 0 end asc,
                      voucher.endsAt asc,
                      voucher.id desc
            """)
    List<Voucher> findAllAvailable(
            @Param("status") VoucherStatus status, @Param("now") Instant now);

    @Query(
            value =
                    """
                    select voucher
                      from Voucher voucher
                     where voucher.status = :status
                       and (voucher.startsAt is null or voucher.startsAt <= :now)
                       and (voucher.endsAt is null or voucher.endsAt > :now)
                       and (voucher.usageLimit is null or voucher.usedCount < voucher.usageLimit)
                       and (
                           :companyId is null
                           or voucher.perCompanyLimit is null
                           or (
                               select count(r)
                                 from VoucherRedemption r
                                where r.voucherId = voucher.id
                                  and r.companyId = :companyId
                           ) < voucher.perCompanyLimit
                       )
                     order by case when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.EMERALD then 0
                                   when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.AMBER then 1
                                   when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.ROSE then 2
                                   when voucher.accentColor = com.techx.intervue.modules.billing.enums.VoucherAccentColor.BLUE then 3
                                   else 4
                              end asc,
                              case when voucher.endsAt is null then 1 else 0 end asc,
                              voucher.endsAt asc,
                              voucher.id desc
                    """,
            countQuery =
                    """
                    select count(voucher)
                      from Voucher voucher
                     where voucher.status = :status
                       and (voucher.startsAt is null or voucher.startsAt <= :now)
                       and (voucher.endsAt is null or voucher.endsAt > :now)
                       and (voucher.usageLimit is null or voucher.usedCount < voucher.usageLimit)
                       and (
                           :companyId is null
                           or voucher.perCompanyLimit is null
                           or (
                               select count(r)
                                 from VoucherRedemption r
                                where r.voucherId = voucher.id
                                  and r.companyId = :companyId
                           ) < voucher.perCompanyLimit
                       )
                    """)
    Page<Voucher> findAvailablePage(
            @Param("status") VoucherStatus status,
            @Param("now") Instant now,
            @Param("companyId") Long companyId,
            Pageable pageable);

    @Query(
            """
            select voucher.id, pkg
              from Voucher voucher
              join voucher.applicablePackages pkg
             where voucher.id in :voucherIds
             order by pkg.displayOrder asc, pkg.id asc
            """)
    List<Object[]> findApplicablePackagesGrouped(@Param("voucherIds") Collection<Long> voucherIds);

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
