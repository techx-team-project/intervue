package com.techx.intervue.modules.billing.resources;

import lombok.Builder;

@Builder
public record VoucherPackageSummaryResource(Long id, String slug, String name) {}
