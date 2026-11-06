package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.modules.company.enums.CompanyLinkState;
import lombok.Builder;
import org.springframework.stereotype.Component;

@Component
public class CompanyLinkStatePolicy {

    @Builder
    public record Facts(
            boolean linked,
            boolean ownProofEffective,
            boolean proofPending,
            boolean proofRejected) {}

    // Choosing a company is only a claim: the state turns VERIFIED by the person's own proof alone.
    public CompanyLinkState stateOf(Facts facts) {
        if (!facts.linked()) {
            return CompanyLinkState.NONE;
        }
        if (facts.ownProofEffective()) {
            return CompanyLinkState.VERIFIED;
        }
        if (facts.proofPending()) {
            return CompanyLinkState.SUBMITTED;
        }
        if (facts.proofRejected()) {
            return CompanyLinkState.REJECTED;
        }
        return CompanyLinkState.CHOSEN;
    }
}
