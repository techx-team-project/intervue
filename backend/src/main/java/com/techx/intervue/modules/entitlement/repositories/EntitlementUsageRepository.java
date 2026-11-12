package com.techx.intervue.modules.entitlement.repositories;

import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntitlementUsageRepository extends JpaRepository<EntitlementUsage, Long> {

    List<EntitlementUsage> findAllByCompanyIdAndStatusOrderByEndsAtAsc(
            Long companyId, EntitlementUsageStatus status);

    List<EntitlementUsage> findAllByStatusAndEndsAtBefore(
            EntitlementUsageStatus status, Instant moment);

    boolean existsByJobIdAndEntitlementTypeAndStatus(
            Long jobId, EntitlementType entitlementType, EntitlementUsageStatus status);

    Optional<EntitlementUsage> findFirstByJobIdAndEntitlementTypeOrderByStartedAtDesc(
            Long jobId, EntitlementType entitlementType);

    List<EntitlementUsage> findAllByCompanyIdAndEntitlementTypeOrderByStartedAtDesc(
            Long companyId, EntitlementType entitlementType);

    interface CompanyUsageSumProjection {
        Long getCompanyId();

        Long getTotalSpent();
    }

    @Query(
            """
            select u.companyId as companyId,
                   coalesce(sum(u.quantity), 0L) as totalSpent
              from EntitlementUsage u
             where u.companyId in :companyIds
               and u.entitlementType = :type
             group by u.companyId
            """)
    List<CompanyUsageSumProjection> sumQuantityByCompanyIds(
            @Param("companyIds") Collection<Long> companyIds, @Param("type") EntitlementType type);
}
