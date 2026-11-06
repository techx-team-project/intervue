package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record TaxLookupResource(
        String taxCode,
        String name,
        String tradingName,
        String address,
        String status,
        boolean existingOnPlatform,
        Long existingCompanyId) {}
