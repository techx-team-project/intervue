package com.techx.intervue.modules.application.requests;

import jakarta.validation.constraints.NotNull;

public record ReapplyRequest(@NotNull Long resumeId) {}
