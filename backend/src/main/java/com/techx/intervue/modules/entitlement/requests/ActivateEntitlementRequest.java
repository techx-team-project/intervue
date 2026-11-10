package com.techx.intervue.modules.entitlement.requests;

/** {@code jobId} is required only for services applied to a single job. */
public record ActivateEntitlementRequest(Long jobId) {}
