package com.techx.intervue.modules.company.requests;

import jakarta.validation.constraints.Size;

public record SearchCompaniesRequest(@Size(max = 100) String q) {}
