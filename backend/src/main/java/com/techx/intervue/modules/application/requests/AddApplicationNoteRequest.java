package com.techx.intervue.modules.application.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddApplicationNoteRequest(@NotBlank @Size(max = 2000) String content) {}
