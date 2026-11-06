package com.techx.intervue.modules.company.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateCompanyRequest(
        @NotBlank
                @Pattern(
                        regexp = "\\d{10}(-?\\d{3})?",
                        message =
                                "Tax code must be 10 digits, optionally followed by a 3-digit branch code")
                String taxCode) {}
