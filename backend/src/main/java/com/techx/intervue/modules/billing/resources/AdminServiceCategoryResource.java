package com.techx.intervue.modules.billing.resources;

public record AdminServiceCategoryResource(
        Long id,
        String code,
        String name,
        String headline,
        String description,
        String needKey,
        Integer displayOrder,
        Boolean isActive,
        Long packageCount) {}
