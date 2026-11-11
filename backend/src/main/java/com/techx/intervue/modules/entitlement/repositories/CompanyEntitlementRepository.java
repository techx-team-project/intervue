package com.techx.intervue.modules.entitlement.repositories;

import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyEntitlementRepository extends JpaRepository<CompanyEntitlement, Long> {

    List<CompanyEntitlement> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);

    List<CompanyEntitlement> findAllBySourceOrderItemIdIn(Collection<Long> sourceOrderItemIds);

    List<CompanyEntitlement> findAllByCompanyIdAndEntitlementTypeOrderByCreatedAtDesc(
            Long companyId, EntitlementType entitlementType);

    Optional<CompanyEntitlement> findBySourceOrderItemId(Long sourceOrderItemId);

    Optional<CompanyEntitlement> findByIdAndCompanyId(Long id, Long companyId);

    List<CompanyEntitlement> findAllByCompanyIdInAndEntitlementTypeAndStatus(
            Collection<Long> companyIds, EntitlementType entitlementType, EntitlementStatus status);

    List<CompanyEntitlement>
            findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                    Long companyId, EntitlementType entitlementType, EntitlementStatus status);

    @Query(
            """
            select e from CompanyEntitlement e
             where e.companyId = :companyId
               and e.entitlementType = :type
               and e.status = com.techx.intervue.modules.entitlement.enums.EntitlementStatus.AVAILABLE
               and e.remainingQuantity > 0
               and (e.activationDeadline is null or e.activationDeadline > :now)
             order by e.activationDeadline asc, e.id asc
            """)
    List<CompanyEntitlement> findUsableLots(
            @Param("companyId") Long companyId,
            @Param("type") EntitlementType type,
            @Param("now") Instant now);

    // Single atomic statement: two publishes racing for the last slot cannot both win
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    // MySQL assigns left to right, so status must read remainingQuantity before it is lowered
    @Query(
            """
            update CompanyEntitlement entitlement
               set entitlement.status = case when entitlement.remainingQuantity - :amount = 0
                                             then com.techx.intervue.modules.entitlement.enums.EntitlementStatus.CONSUMED
                                             else entitlement.status end,
                   entitlement.remainingQuantity = entitlement.remainingQuantity - :amount
             where entitlement.id = :id
               and entitlement.remainingQuantity >= :amount
               and entitlement.status = com.techx.intervue.modules.entitlement.enums.EntitlementStatus.AVAILABLE
               and (entitlement.activationDeadline is null or entitlement.activationDeadline > :now)
            """)
    int consume(@Param("id") Long id, @Param("amount") int amount, @Param("now") Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            """
            update CompanyEntitlement entitlement
               set entitlement.status = com.techx.intervue.modules.entitlement.enums.EntitlementStatus.EXPIRED
             where entitlement.status = com.techx.intervue.modules.entitlement.enums.EntitlementStatus.AVAILABLE
               and entitlement.activationDeadline < :moment
            """)
    int expireOverdue(@Param("moment") Instant moment);
}
