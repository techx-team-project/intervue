package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.BusinessType;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CompanyResource(
        Long id,
        String name,
        String taxCode,
        String registeredAddress,
        String tradingName,
        BusinessType businessType,
        String industry,
        String website,
        String market,
        String targetCustomers,
        String size,
        String email,
        String phone,
        String address,
        String description,
        String benefits,
        String logoUrl,
        List<CompanyPhotoResource> photos,
        boolean profileComplete,
        int photoLimit,
        Instant brandPageUntil,
        Instant featuredUntil,
        List<String> missingFields,
        Instant createdAt,
        Instant updatedAt) {}
