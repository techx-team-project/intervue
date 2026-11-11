package com.techx.intervue.modules.connect.requests;

import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportConversationRequest(
        @NotNull ReportReasonCode reasonCode, @Size(max = 1000) String reasonNote) {}
