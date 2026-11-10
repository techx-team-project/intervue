package com.techx.intervue.modules.moderation.requests;

import jakarta.validation.constraints.Size;

public record AdminDismissReportRequest(@Size(max = 1000) String note) {}
