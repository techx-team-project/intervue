package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenameCandidateResumeRequest(@NotBlank @Size(max = 150) String fileName) {}
