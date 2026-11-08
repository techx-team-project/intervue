package com.techx.intervue.modules.recruiter.requests;

import com.techx.intervue.modules.recruiter.enums.RecruiterGender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RecruiterProfileRequest(
        @NotBlank(message = "Full name is required!")
                @Size(max = 50, message = "Full name must be at most 50 characters!")
                String name,
        RecruiterGender gender,
        @Size(max = 255, message = "Company name must be at most 255 characters!")
                String companyName,
        @Size(max = 100, message = "Province must be at most 100 characters!") String province,
        @Size(max = 255, message = "District / ward must be at most 255 characters!")
                String districtWard) {}
