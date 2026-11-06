package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CompanyMemberResource(
        Long userId,
        String name,
        String email,
        CompanyMemberStatus status,
        Instant joinedAt,
        boolean canPublish,
        boolean phoneVerified,
        boolean userAgreementAccepted) {

    @JsonProperty("fullName")
    public String fullName() {
        return name;
    }

    @JsonProperty("id")
    public Long id() {
        return userId;
    }
}
