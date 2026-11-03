package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;

public record SendPhoneOtpRequest(@NotBlank @VietnamMobilePhone String phone) {}
