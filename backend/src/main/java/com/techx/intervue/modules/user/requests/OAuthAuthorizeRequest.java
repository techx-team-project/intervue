package com.techx.intervue.modules.user.requests;

import com.techx.intervue.modules.user.enums.OAuthIntent;
import jakarta.validation.constraints.NotNull;

public record OAuthAuthorizeRequest(
        @NotNull(message = "Intent is required!") OAuthIntent intent, Boolean acceptTerms) {}
