package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.ServicePackageBadge;
import java.util.List;

public record ServicePackageDetailResource(
        Long id,
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
        Boolean oneTimePerCompany,
        String categoryCode,
        String categoryName,
        String categoryHeadline,
        List<ServicePackageBenefitResource> benefits,
        List<ServicePackageSectionResource> sections) {}
