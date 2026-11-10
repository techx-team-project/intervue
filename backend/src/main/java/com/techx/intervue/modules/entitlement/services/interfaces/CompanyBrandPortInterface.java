package com.techx.intervue.modules.entitlement.services.interfaces;

import java.time.Instant;

/**
 * Implemented by the company module so entitlement can grant paid branding without importing
 * company internals.
 */
public interface CompanyBrandPortInterface {

    void grantFeatured(Long companyId, Instant until);

    void grantBrandPage(Long companyId, Instant until);
}
