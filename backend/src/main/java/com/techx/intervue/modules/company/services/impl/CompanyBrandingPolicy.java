package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.modules.company.entities.Company;
import java.time.Instant;
import org.springframework.stereotype.Component;

@Component
public class CompanyBrandingPolicy {

    private static final int FREE_PHOTOS = 3;
    private static final int BRAND_PAGE_PHOTOS = 10;

    public boolean hasBrandPage(Company company) {
        return isRunning(company.getBrandPageUntil());
    }

    public boolean isFeatured(Company company) {
        return isRunning(company.getFeaturedUntil());
    }

    public int photoLimit(Company company) {
        return hasBrandPage(company) ? BRAND_PAGE_PHOTOS : FREE_PHOTOS;
    }

    private boolean isRunning(Instant until) {
        return until != null && until.isAfter(Instant.now());
    }
}
