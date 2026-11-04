package com.techx.intervue.modules.recruiter.mappers;

import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import org.springframework.stereotype.Component;

@Component
public class RecruiterMapper {

    public RecruiterResource toResource(Recruiter recruiter) {
        return RecruiterResource.builder()
                .id(recruiter.getId())
                .email(recruiter.getEmail())
                .name(recruiter.getName())
                .phone(recruiter.getPhone())
                .status(recruiter.getStatus())
                .emailVerified(recruiter.isEmailVerified())
                .createdAt(recruiter.getCreatedAt())
                .build();
    }
}
