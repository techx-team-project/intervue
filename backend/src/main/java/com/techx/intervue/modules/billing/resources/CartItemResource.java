package com.techx.intervue.modules.billing.resources;

public record CartItemResource(
        Long id,
        Long packageId,
        String code,
        String slug,
        String name,
        String shortDescription,
        Long unitPrice,
        String currency,
        Integer quantity,
        Long lineTotal,
        Integer validityDays,
        Boolean oneTimePerCompany) {}
