package com.techx.intervue.modules.connect.requests;

import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import com.techx.intervue.modules.connect.enums.FilterScope;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateFilterWordRequest(
        @NotBlank(message = "Pattern is required")
                @Size(max = 255, message = "Pattern must not exceed 255 characters")
                String pattern,
        FilterScope scope,
        boolean regex,
        @NotNull(message = "Severity is required") ConnectFilterSeverity severity,
        boolean active,
        @Size(max = 500, message = "Note must not exceed 500 characters") String note) {}
