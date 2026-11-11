package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.ServicePackageBadge;
import java.util.List;

public record ServicePackageCardResource(
        Long id,
        String code,
        String slug,
        String name,
        String shortDescription,
        Long price,
        String currency,
        ServicePackageBadge badge,
        Boolean vipRibbon,
        String accentColor,
        Integer validityDays,
        Integer bonusCredits,
        Boolean oneTimePerCompany,
        List<ServicePackageBenefitResource> benefits) {}
