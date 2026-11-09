package com.techx.intervue.modules.billing.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SepayTransaction(
        String id,
        @JsonProperty("bank_brand_name") String bankBrandName,
        @JsonProperty("account_number") String accountNumber,
        @JsonProperty("transaction_date") String transactionDate,
        @JsonProperty("amount_in") String amountIn,
        @JsonProperty("transaction_content") String transactionContent,
        @JsonProperty("reference_number") String referenceNumber) {}
