package com.techx.intervue.modules.connect.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReactMessageRequest(@NotBlank @Size(max = 16) String emoji) {}
