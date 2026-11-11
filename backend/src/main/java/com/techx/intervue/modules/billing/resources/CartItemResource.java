package com.techx.intervue.modules.billing.resources;

import java.time.LocalDate;
import java.util.List;

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
        Boolean oneTimePerCompany,
        Boolean adSlotItem,
        List<LocalDate> weeks) {}
