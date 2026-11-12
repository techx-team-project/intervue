package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.modules.company.entities.Company;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyBrandingPolicy {

    private static final int BRAND_PAGE_PHOTOS = 10;

    private final FreeQuotaPolicyInterface freeQuotaPolicy;

    public boolean hasBrandPage(Company company) {
        return isRunning(company.getBrandPageUntil());
    }

    public boolean isFeatured(Company company) {
        return isRunning(company.getFeaturedUntil());
    }

    public int photoLimit(Company company) {
        int freeLimit = freeQuotaPolicy.current().companyFreePhotoLimit();
        return hasBrandPage(company) ? Math.max(BRAND_PAGE_PHOTOS, freeLimit) : freeLimit;
    }

    private boolean isRunning(Instant until) {
        return until != null && until.isAfter(Instant.now());
    }
}
