package com.techx.intervue.modules.billing.resources;

import java.time.Instant;

public record PaymentSyncResultResource(
        Instant at, boolean ok, String message, int fetched, int created, int matched) {}
