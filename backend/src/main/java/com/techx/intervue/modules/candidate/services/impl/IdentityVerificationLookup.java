package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.modules.application.services.interfaces.IdentityVerificationLookupInterface;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import com.techx.intervue.modules.candidate.repositories.IdentityVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IdentityVerificationLookup implements IdentityVerificationLookupInterface {

    private final IdentityVerificationRepository repository;

    @Override
    public boolean isVerified(Long candidateId) {
        return repository.existsByUserIdAndStatus(candidateId, IdentityVerificationStatus.APPROVED);
    }
}
