package com.techx.intervue.modules.connect.requests;

import com.techx.intervue.modules.connect.enums.UnsendScope;
import jakarta.validation.constraints.NotNull;

public record UnsendMessageRequest(@NotNull UnsendScope scope) {}
