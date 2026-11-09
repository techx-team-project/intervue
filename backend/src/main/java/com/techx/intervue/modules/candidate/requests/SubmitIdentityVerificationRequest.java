package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public record SubmitIdentityVerificationRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Pattern(regexp = "^([0-9]{9}|[0-9]{12})$", message = "Must be 9 or 12 digits")
                String idNumber,
        @NotNull @Past @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth) {}
