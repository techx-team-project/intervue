package com.techx.intervue.modules.ads.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SaveAdCreativeRequest(
        @NotBlank @Size(max = 500) @Pattern(regexp = "^https?://.+") String targetUrl,
        @Size(max = 255) String altText) {}
