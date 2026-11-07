package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.common.oauth.OAuthProfile;
import com.techx.intervue.common.oauth.OAuthProfiles;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.entities.RecruiterSocialAccount;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterSocialAccountRepository;
import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResult;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterAuthServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSocialSignInServiceInterface;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.events.SecuritySettingChangedEvent;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterSocialSignInService implements RecruiterSocialSignInServiceInterface {

    private final RecruiterRepository recruiterRepository;
    private final RecruiterSocialAccountRepository recruiterSocialAccountRepository;
    private final RecruiterAuthServiceInterface recruiterAuthService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public RecruiterAuthResult signIn(
            OAuthProvider provider,
            OAuthProfile profile,
            boolean acceptTerms,
            String userAgent,
            String ip,
            String rawDeviceToken) {
        Resolved resolved = resolveRecruiter(provider, profile, acceptTerms);
        RecruiterAuthResult result =
                recruiterAuthService.completeSignIn(
                        resolved.recruiter(), userAgent, ip, rawDeviceToken);
        return resolved.created() ? result.asNewAccount() : result;
    }

    private Resolved resolveRecruiter(
            OAuthProvider provider, OAuthProfile profile, boolean acceptTerms) {
        RecruiterSocialAccount link =
                recruiterSocialAccountRepository
                        .findByProviderAndProviderSubject(provider, profile.subject())
                        .orElse(null);
        if (link != null) {
            Recruiter linked =
                    recruiterRepository
                            .findById(link.getRecruiterId())
                            .orElseThrow(() -> new AppException(ErrorCode.OAUTH_ACCOUNT_NOT_FOUND));
            return new Resolved(linked, false);
        }

        String email = OAuthProfiles.authoritativeEmail(profile);

        Recruiter existing = recruiterRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            if (!existing.isEmailVerified()) {
                throw new AppException(ErrorCode.OAUTH_LINK_REQUIRES_VERIFIED_EMAIL);
            }
            linkAccount(existing, provider, profile, email);
            notifyLinked(existing, provider);
            return new Resolved(existing, false);
        }

        if (!acceptTerms) {
            throw new AppException(ErrorCode.OAUTH_ACCOUNT_NOT_FOUND);
        }
        return new Resolved(registerRecruiter(provider, profile, email), true);
    }

    private Recruiter registerRecruiter(
            OAuthProvider provider, OAuthProfile profile, String email) {
        Instant now = Instant.now();
        Recruiter saved =
                recruiterRepository.save(
                        Recruiter.builder()
                                .name(OAuthProfiles.displayName(profile.name(), email))
                                .email(email)
                                .password(null)
                                .emailVerifiedAt(now)
                                .termsAcceptedAt(now)
                                .build());
        linkAccount(saved, provider, profile, email);
        return saved;
    }

    private void linkAccount(
            Recruiter recruiter, OAuthProvider provider, OAuthProfile profile, String email) {
        recruiterSocialAccountRepository.save(
                RecruiterSocialAccount.builder()
                        .recruiterId(recruiter.getId())
                        .provider(provider)
                        .providerSubject(profile.subject())
                        .email(email)
                        .build());
    }

    private void notifyLinked(Recruiter recruiter, OAuthProvider provider) {
        eventPublisher.publishEvent(
                new SecuritySettingChangedEvent(
                        AccountType.RECRUITER,
                        recruiter.getId(),
                        provider.getDisplayName() + " sign-in was linked to your account."));
    }

    private record Resolved(Recruiter recruiter, boolean created) {}
}
