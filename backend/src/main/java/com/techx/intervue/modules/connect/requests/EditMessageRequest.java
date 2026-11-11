package com.techx.intervue.modules.connect.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EditMessageRequest(
        @NotBlank @Size(max = 2000) String body, Boolean suppressLinkPreview) {}
