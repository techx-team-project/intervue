package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.oauth.OAuthProfile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.Role;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserSocialAccount;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.events.SecuritySettingChangedEvent;
import com.techx.intervue.modules.user.repositories.RoleRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.repositories.UserSocialAccountRepository;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.services.interfaces.AuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.SocialSignInServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SocialSignInService implements SocialSignInServiceInterface {

    private static final int MAX_NAME_LENGTH = 50;
    private static final int MAX_EMAIL_LENGTH = 100;
    private static final String GMAIL_SUFFIX = "@gmail.com";

    private final UserRepository userRepository;
    private final UserSocialAccountRepository userSocialAccountRepository;
    private final RoleRepository roleRepository;
    private final AuthServiceInterface authService;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public AuthResult signIn(
            OAuthProvider provider,
            OAuthProfile profile,
            boolean acceptTerms,
            String userAgent,
            String ip) {
        User user = resolveUser(provider, profile, acceptTerms, ip);
        return authService.completeSignIn(user, userAgent, ip);
    }

    private User resolveUser(
            OAuthProvider provider, OAuthProfile profile, boolean acceptTerms, String ip) {
        UserSocialAccount link =
                userSocialAccountRepository
                        .findByProviderAndProviderSubject(provider, profile.subject())
                        .orElse(null);
        if (link != null) {
            User linked =
                    userRepository
                            .findByIdWithRoles(link.getUserId())
                            .orElseThrow(() -> new AppException(ErrorCode.OAUTH_ACCOUNT_NOT_FOUND));
            ensureNotAdmin(linked);
            return linked;
        }

        String email = authoritativeEmail(profile);

        User existing = userRepository.findByEmailWithRoles(email).orElse(null);
        if (existing != null) {
            ensureNotAdmin(existing);
            if (!existing.isEmailVerified()) {
                throw new AppException(ErrorCode.OAUTH_LINK_REQUIRES_VERIFIED_EMAIL);
            }
            linkAccount(existing, provider, profile, email);
            notifyLinked(existing, provider, ip);
            return existing;
        }

        if (!acceptTerms) {
            throw new AppException(ErrorCode.OAUTH_ACCOUNT_NOT_FOUND);
        }
        return registerCandidate(provider, profile, email, ip);
    }

    private User registerCandidate(
            OAuthProvider provider, OAuthProfile profile, String email, String ip) {
        Instant now = Instant.now();
        User user =
                User.builder()
                        .name(displayName(profile.name(), email))
                        .email(email)
                        .password(null)
                        .emailVerifiedAt(now)
                        .termsAcceptedAt(now)
                        .build();
        user.addRole(findCandidateRole());
        User saved = userRepository.save(user);
        linkAccount(saved, provider, profile, email);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(saved.getId())
                        .actorEmail(saved.getEmail())
                        .action(AuditAction.USER_REGISTERED)
                        .targetType(AuditTargetType.USER)
                        .targetId(saved.getId())
                        .reason("Account registered with " + provider.getDisplayName())
                        .ip(ip)
                        .build());
        return saved;
    }

    private void linkAccount(
            User user, OAuthProvider provider, OAuthProfile profile, String email) {
        userSocialAccountRepository.save(
                UserSocialAccount.builder()
                        .userId(user.getId())
                        .provider(provider)
                        .providerSubject(profile.subject())
                        .email(email)
                        .build());
    }

    private String authoritativeEmail(OAuthProfile profile) {
        if (profile.email() == null || profile.email().isBlank() || !profile.emailVerified()) {
            throw new AppException(ErrorCode.OAUTH_EMAIL_UNVERIFIED);
        }
        String email = EmailHelper.normalize(profile.email());
        boolean authoritative =
                email.endsWith(GMAIL_SUFFIX)
                        || (profile.hostedDomain() != null && !profile.hostedDomain().isBlank());
        if (!authoritative || email.length() > MAX_EMAIL_LENGTH) {
            throw new AppException(ErrorCode.OAUTH_EMAIL_UNVERIFIED);
        }
        return email;
    }

    private void notifyLinked(User user, OAuthProvider provider, String ip) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(user.getId())
                        .actorEmail(user.getEmail())
                        .action(AuditAction.SOCIAL_ACCOUNT_LINKED)
                        .targetType(AuditTargetType.USER)
                        .targetId(user.getId())
                        .reason(provider.getDisplayName() + " sign-in linked to the account")
                        .ip(ip)
                        .build());
        eventPublisher.publishEvent(
                new SecuritySettingChangedEvent(
                        AccountType.USER,
                        user.getId(),
                        provider.getDisplayName() + " sign-in was linked to your account."));
    }

    private void ensureNotAdmin(User user) {
        if (user.hasRole(RoleType.ADMIN)) {
            throw new AppException(ErrorCode.SOCIAL_LOGIN_NOT_ALLOWED);
        }
    }

    private String displayName(String providerName, String email) {
        String name =
                providerName != null && !providerName.isBlank()
                        ? providerName.trim()
                        : email.substring(0, email.indexOf('@'));
        return name.codePointCount(0, name.length()) > MAX_NAME_LENGTH
                ? name.substring(0, name.offsetByCodePoints(0, MAX_NAME_LENGTH))
                : name;
    }

    private Role findCandidateRole() {
        return roleRepository
                .findByName(RoleType.CANDIDATE)
                .orElseThrow(() -> new IllegalStateException("CANDIDATE role is missing"));
    }
}
