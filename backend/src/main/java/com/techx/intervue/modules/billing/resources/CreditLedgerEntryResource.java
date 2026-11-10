package com.techx.intervue.modules.billing.resources;

import java.time.Instant;

public record CreditLedgerEntryResource(boolean credit, int quantity, String label, Instant at) {}
