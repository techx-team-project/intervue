package com.techx.intervue.modules.company.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SearchCompaniesRequest(@NotBlank @Size(min = 2, max = 100) String q) {}
