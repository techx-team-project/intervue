package com.techx.intervue.modules.company.requests;

import com.techx.intervue.modules.company.enums.BusinessType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SaveCompanyProfileRequest(
        @NotBlank @Size(max = 255) String name,
        @Size(max = 255) String tradingName,
        @NotBlank
                @Pattern(
                        regexp = "\\d{10}|\\d{13}",
                        message = "Tax code must be either 10 or 13 digits")
                String taxCode,
        @NotNull BusinessType businessType,
        @Size(max = 150) String industry,
        @Size(max = 255) String website,
        @Size(max = 150) String market,
        @Size(max = 150) String targetCustomers,
        @Size(max = 30) String size,
        @Email @Size(max = 255) String email,
        @Size(max = 20) String phone,
        @Size(max = 500) String address,
        @Size(max = 20000) String description,
        @Size(max = 20000) String benefits) {}
