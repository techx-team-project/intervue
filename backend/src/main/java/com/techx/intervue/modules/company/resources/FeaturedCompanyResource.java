package com.techx.intervue.modules.company.resources;

import lombok.Builder;

@Builder
public record FeaturedCompanyResource(Long id, String name, String logoUrl, String industry) {}
