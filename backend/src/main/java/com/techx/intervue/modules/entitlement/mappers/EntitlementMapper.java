package com.techx.intervue.modules.entitlement.mappers;

import com.techx.intervue.modules.entitlement.entities.CompanyEntitlement;
import com.techx.intervue.modules.entitlement.entities.EntitlementUsage;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.resources.EntitlementResource;
import com.techx.intervue.modules.entitlement.resources.EntitlementUsageResource;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class EntitlementMapper {

    public static final Set<EntitlementType> ACTIVATABLE_ON_JOB =
            Set.of(
                    EntitlementType.JOB_BOOST,
                    EntitlementType.JOB_LABEL_URGENT,
                    EntitlementType.JOB_LABEL_HOT,
                    EntitlementType.JOB_HIGHLIGHT);

    public static final Set<EntitlementType> ACTIVATABLE_ON_COMPANY =
            Set.of(EntitlementType.BRAND_PAGE, EntitlementType.FEATURED_COMPANY);

    public EntitlementResource toResource(CompanyEntitlement entitlement) {
        return new EntitlementResource(
                entitlement.getId(),
                entitlement.getEntitlementType(),
                entitlement.getLabel(),
                entitlement.getTotalQuantity(),
                entitlement.getRemainingQuantity(),
                entitlement.getTier(),
                entitlement.getDurationDays(),
                entitlement.getStatus(),
                entitlement.getActivationDeadline(),
                entitlement.getPurchasedByRecruiterId(),
                ACTIVATABLE_ON_JOB.contains(entitlement.getEntitlementType())
                        || ACTIVATABLE_ON_COMPANY.contains(entitlement.getEntitlementType()),
                entitlement.getCreatedAt());
    }

    public EntitlementUsageResource toUsageResource(EntitlementUsage usage, String label) {
        return new EntitlementUsageResource(
                usage.getId(),
                usage.getEntitlementType(),
                label,
                usage.getJobId(),
                usage.getQuantity(),
                usage.getStartedAt(),
                usage.getEndsAt(),
                usage.getStatus());
    }
}
