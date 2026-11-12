package com.techx.intervue.modules.entitlement.services.interfaces;

import java.time.Instant;

/**
 * Implemented by the job module so entitlement can apply effects without importing job internals.
 */
public interface JobBoostPortInterface {

    boolean isPublishedJobOfCompany(Long jobId, Long companyId);

    void applyLabel(Long jobId, String label, Instant expiresAt);

    void applyHighlight(Long jobId, Instant expiresAt);

    void clearExpiredLabel(Long jobId, String expectedLabel);

    void clearExpiredHighlight(Long jobId);
}
