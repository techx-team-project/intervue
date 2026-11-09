package com.techx.intervue.modules.billing.resources;

import java.util.List;

public record ServiceCategoryResource(
        Long id,
        String code,
        String name,
        String headline,
        String description,
        String needKey,
        List<ServicePackageCardResource> packages) {}
