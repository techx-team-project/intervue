package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CompanySummaryResource(
        Long id,
        String name,
        String tradingName,
        String taxCode,
        String industry,
        String size,
        String address,
        String logoUrl,
        boolean verified) {}
