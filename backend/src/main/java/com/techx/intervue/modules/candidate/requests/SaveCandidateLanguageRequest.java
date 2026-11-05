package com.techx.intervue.modules.candidate.requests;

import com.techx.intervue.modules.candidate.enums.LanguageProficiency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SaveCandidateLanguageRequest(
        @NotBlank @Size(max = 60) String language,
        @NotNull LanguageProficiency proficiency,
        @Size(max = 100) String certificate) {}
