package com.techx.intervue.modules.entitlement.requests;

import jakarta.validation.constraints.NotNull;

public record ActivateEntitlementRequest(@NotNull Long jobId) {}
