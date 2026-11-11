package com.techx.intervue.modules.billing.resources;

import java.time.LocalDate;
import java.util.List;

public record OrderItemResource(
        Long id,
        Long packageId,
        String packageCode,
        String packageName,
        Long unitPrice,
        Integer quantity,
        Long lineTotal,
        Integer validityDays,
        Integer bonusCredits,
        List<ServicePackageBenefitResource> benefits,
        List<LocalDate> bookedWeeks) {}
