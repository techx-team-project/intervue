package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.config.ApplicationProperties;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.services.interfaces.IdentityVerificationLookupInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface.ApplyTarget;
import java.time.LocalDate;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationEligibility {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final ApplicationProperties properties;
    private final IdentityVerificationLookupInterface identityLookup;
    private final CompanyServiceInterface companyService;
    private final ApplicationRepository applicationRepository;
    private final FreeQuotaPolicyInterface freeQuotaPolicy;

    public void requireCanApply(ApplyTarget target, RequestActor actor) {
        if (!target.open()) {
            throw new AppException(ErrorCode.JOB_NOT_OPEN);
        }
        if (properties.requireIdentityVerification()
                && !identityLookup.isVerified(actor.userId())) {
            throw new AppException(ErrorCode.IDENTITY_NOT_VERIFIED);
        }
        if (companyService.hasActiveMemberWithEmail(target.companyId(), actor.email())) {
            throw new AppException(ErrorCode.CANNOT_APPLY_TO_OWN_COMPANY);
        }
    }

    public void requireWithinDailyLimit(Long candidateId) {
        var startOfDay = LocalDate.now(BUSINESS_ZONE).atStartOfDay(BUSINESS_ZONE).toInstant();
        long submittedToday =
                applicationRepository.countByCandidateIdAndSubmittedAtGreaterThanEqual(
                        candidateId, startOfDay);
        if (submittedToday >= freeQuotaPolicy.current().candidateDailyApplicationLimit()) {
            throw new AppException(ErrorCode.APPLICATION_DAILY_LIMIT_REACHED);
        }
    }
}
