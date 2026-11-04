package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.exceptions.ErrorCode;
import lombok.Builder;
import org.springframework.stereotype.Component;

@Component
public class CompanyVerificationLevelPolicy {

    public static final int LEVEL_BASIC = 1;
    public static final int LEVEL_STANDARD = 2;
    public static final int LEVEL_VERIFIED_ENTERPRISE = 3;

    @Builder
    public record Facts(
            boolean emailVerified,
            boolean phoneVerified,
            boolean companyLinked,
            boolean companyAgreementSigned,
            boolean personalAgreementsAccepted,
            boolean companyVerified,
            boolean ownDocumentEffective) {}

    public int levelOf(Facts facts) {
        if (!facts.emailVerified()) {
            return 0;
        }
        if (!meetsStandard(facts)) {
            return LEVEL_BASIC;
        }
        return canPublish(facts) ? LEVEL_VERIFIED_ENTERPRISE : LEVEL_STANDARD;
    }

    // Expressed as the two concrete conditions rather than a level number: adding a sixth
    // checklist step must never silently move the line that decides who may publish a job.
    public boolean canPublish(Facts facts) {
        return meetsStandard(facts) && facts.companyVerified() && facts.ownDocumentEffective();
    }

    public ErrorCode blockedReason(Facts facts) {
        if (canPublish(facts)) {
            return null;
        }
        if (!facts.emailVerified()) {
            return ErrorCode.EMAIL_NOT_VERIFIED;
        }
        if (!facts.companyLinked()) {
            return ErrorCode.NOT_COMPANY_MEMBER;
        }
        if (!facts.companyAgreementSigned()) {
            return ErrorCode.COMPANY_AGREEMENT_MISSING;
        }
        if (!facts.phoneVerified() || !facts.personalAgreementsAccepted()) {
            return ErrorCode.VERIFICATION_INCOMPLETE;
        }
        if (!facts.companyVerified()) {
            return ErrorCode.COMPANY_NOT_VERIFIED;
        }
        return ErrorCode.RECRUITER_NOT_AUTHORIZED_FOR_COMPANY;
    }

    private boolean meetsStandard(Facts facts) {
        return facts.emailVerified()
                && facts.phoneVerified()
                && facts.companyLinked()
                && facts.companyAgreementSigned()
                && facts.personalAgreementsAccepted();
    }
}
