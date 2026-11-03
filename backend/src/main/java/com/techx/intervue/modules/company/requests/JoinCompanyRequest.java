package com.techx.intervue.modules.company.requests;

import jakarta.validation.constraints.NotNull;

public record JoinCompanyRequest(@NotNull Long companyId) {}
