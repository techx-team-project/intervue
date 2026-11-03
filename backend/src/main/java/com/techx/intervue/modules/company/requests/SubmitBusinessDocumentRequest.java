package com.techx.intervue.modules.company.requests;

import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import jakarta.validation.constraints.NotNull;

public record SubmitBusinessDocumentRequest(@NotNull BusinessDocumentType documentType) {}
