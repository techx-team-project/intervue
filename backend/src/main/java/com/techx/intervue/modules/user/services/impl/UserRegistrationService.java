package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.Role;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.events.EmailVerificationRequestedEvent;
import com.techx.intervue.modules.user.repositories.RoleRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserRegistrationServiceInterface;
import java.time.Instant;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserRegistrationService implements UserRegistrationServiceInterface {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthSessionServiceInterface authSessionService;
    private final ApplicationEventPublisher eventPublisher;
    private final AuditLogServiceInterface auditLogService;

    public UserRegistrationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthSessionServiceInterface authSessionService,
            ApplicationEventPublisher eventPublisher,
            AuditLogServiceInterface auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authSessionService = authSessionService;
        this.eventPublisher = eventPublisher;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public AuthResult register(RegisterRequest request) {
        return register(request, null, null);
    }

    @Override
    @Transactional
    public AuthResult register(RegisterRequest request, String userAgent, String ip) {
        String email = EmailHelper.normalize(request.email());
        PasswordPolicy.verify(request.password(), request.confirmPassword(), email);
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }

        User user =
                User.builder()
                        .name(request.name().trim())
                        .email(email)
                        .password(passwordEncoder.encode(request.password()))
                        .termsAcceptedAt(Instant.now())
                        .build();
        user.addRole(findCandidateRole());
        User saved = userRepository.save(user);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(saved.getId())
                        .actorEmail(saved.getEmail())
                        .action(AuditAction.USER_REGISTERED)
                        .targetType(AuditTargetType.USER)
                        .targetId(saved.getId())
                        .reason("Account self-registered as candidate")
                        .ip(ip)
                        .build());

        eventPublisher.publishEvent(
                new EmailVerificationRequestedEvent(
                        saved.getId(), saved.getEmail(), saved.getName()));

        return authSessionService.open(saved, userAgent, ip);
    }

    private Role findCandidateRole() {
        return roleRepository
                .findByName(RoleType.CANDIDATE)
                .orElseThrow(() -> new IllegalStateException("CANDIDATE role is missing"));
    }
}
