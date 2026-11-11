package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PublicCompanyResource(
        Long id,
        String name,
        String tradingName,
        String address,
        String industry,
        String size,
        String website,
        String email,
        String phone,
        String description,
        String benefits,
        String logoUrl,
        List<String> photoUrls,
        Boolean featured,
        Boolean brandPageActive) {}
