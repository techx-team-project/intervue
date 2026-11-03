package com.techx.intervue.modules.company.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RevokeDocumentRequest(@NotBlank @Size(max = 500) String reason) {}
