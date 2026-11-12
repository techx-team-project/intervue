package com.techx.intervue.modules.billing.resources;

import lombok.Builder;

@Builder
public record VoucherPackageSummaryResource(Long id, String code, String slug, String name) {}
