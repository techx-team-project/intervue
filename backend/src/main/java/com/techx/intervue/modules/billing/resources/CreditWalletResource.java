package com.techx.intervue.modules.billing.resources;

import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record CreditWalletResource(
        int balance, Instant nearestExpiryAt, List<CreditPriceResource> prices) {}
