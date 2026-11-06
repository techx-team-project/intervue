package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.BusinessType;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminCompanyFactsResource(
        Long id,
        String name,
        String tradingName,
        String taxCode,
        String registeredAddress,
        BusinessType businessType,
        String industry,
        String size,
        String address,
        String email,
        String phone,
        String website,
        boolean profileComplete,
        int memberCount,
        Instant createdAt) {}
