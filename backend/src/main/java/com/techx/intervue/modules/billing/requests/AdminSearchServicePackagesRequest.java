package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import jakarta.validation.constraints.Size;

public record AdminSearchServicePackagesRequest(
        @Size(max = 100) String query, Long categoryId, ServicePackageStatus status) {}
