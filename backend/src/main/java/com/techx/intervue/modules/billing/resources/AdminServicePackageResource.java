package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.ServicePackageBadge;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import java.util.List;

public record AdminServicePackageResource(
        Long id,
        Long categoryId,
        String categoryCode,
        String code,
        String slug,
        String name,
        String shortDescription,
        Long price,
        String currency,
        ServicePackageBadge badge,
        Boolean vipRibbon,
        String accentColor,
        String heroImageUrl,
        Integer validityDays,
        Integer bonusCredits,
        Boolean oneTimePerCompany,
        ServicePackageStatus status,
        Integer displayOrder,
        List<ServicePackageBenefitResource> benefits,
        List<ServicePackageSectionResource> sections) {}
