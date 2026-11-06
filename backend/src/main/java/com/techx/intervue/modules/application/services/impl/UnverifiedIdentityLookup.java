package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.services.interfaces.IdentityVerificationLookupInterface;
import org.springframework.stereotype.Component;

// The eKYC module does not exist yet; it replaces this with the real status lookup.
@Component
public class UnverifiedIdentityLookup implements IdentityVerificationLookupInterface {

    @Override
    public boolean isVerified(Long candidateId) {
        return false;
    }
}
