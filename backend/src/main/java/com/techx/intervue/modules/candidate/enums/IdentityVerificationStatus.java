package com.techx.intervue.modules.candidate.enums;

import java.util.EnumSet;
import java.util.Set;

public enum IdentityVerificationStatus {
    PENDING,
    APPROVED,
    REJECTED;

    public static final Set<IdentityVerificationStatus> HOLDING_ID_NUMBER =
            EnumSet.of(PENDING, APPROVED);
}
