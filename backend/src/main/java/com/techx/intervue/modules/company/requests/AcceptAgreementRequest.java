package com.techx.intervue.modules.company.requests;

import com.techx.intervue.modules.company.enums.AgreementType;
import jakarta.validation.constraints.NotNull;

public record AcceptAgreementRequest(@NotNull AgreementType agreementType) {}
