package com.techx.intervue.modules.entitlement.repositories;

import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyEntitlementRepository extends JpaRepository<CompanyEntitlement, Long> {

    List<CompanyEntitlement> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);

    Optional<CompanyEntitlement> findByIdAndCompanyId(Long id, Long companyId);

    List<CompanyEntitlement>
            findAllByCompanyIdAndEntitlementTypeAndStatusOrderByActivationDeadlineAsc(
                    Long companyId, EntitlementType entitlementType, EntitlementStatus status);

    // Single atomic statement: two publishes racing for the last slot cannot both win
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            """
            update CompanyEntitlement entitlement
               set entitlement.remainingQuantity = entitlement.remainingQuantity - :amount,
                   entitlement.status = case when entitlement.remainingQuantity - :amount = 0
                                             then com.techx.intervue.modules.entitlement.enums.EntitlementStatus.CONSUMED
                                             else entitlement.status end
             where entitlement.id = :id
               and entitlement.remainingQuantity >= :amount
               and entitlement.status = com.techx.intervue.modules.entitlement.enums.EntitlementStatus.AVAILABLE
            """)
    int consume(@Param("id") Long id, @Param("amount") int amount);

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
