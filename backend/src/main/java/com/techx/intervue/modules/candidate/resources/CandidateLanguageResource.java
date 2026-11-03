package com.techx.intervue.modules.candidate.resources;

import com.techx.intervue.modules.candidate.enums.LanguageProficiency;
import lombok.Builder;

@Builder
public record CandidateLanguageResource(
        Long id, String language, LanguageProficiency proficiency, String certificate) {}
