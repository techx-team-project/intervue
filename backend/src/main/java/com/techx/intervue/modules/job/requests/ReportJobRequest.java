package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportJobRequest(
        @NotNull ReportReasonCode reasonCode, @Size(max = 500) String note) {}
