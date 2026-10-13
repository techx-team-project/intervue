package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.Role;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.events.EmailVerificationRequestedEvent;
import com.techx.intervue.modules.user.mappers.UserMapper;
import com.techx.intervue.modules.user.repositories.RoleRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import com.techx.intervue.services.impl.BaseService;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService extends BaseService implements UserServiceInterface {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthSessionServiceInterface authSessionService;
    private final ApplicationEventPublisher eventPublisher;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResult register(RegisterRequest request) {
        String email = EmailHelper.normalize(request.email());
        PasswordPolicy.verify(request.password(), request.confirmPassword(), email);
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }

        Role candidateRole =
                roleRepository
                        .findByName(RoleType.CANDIDATE)
                        .orElseThrow(() -> new IllegalStateException("CANDIDATE role is missing"));
        User user =
                User.builder()
                        .name(request.name().trim())
                        .email(email)
                        .password(passwordEncoder.encode(request.password()))
                        .termsAcceptedAt(Instant.now())
                        .build();
        user.addRole(candidateRole);
        User saved = userRepository.save(user);

        eventPublisher.publishEvent(
                new EmailVerificationRequestedEvent(
                        saved.getId(), saved.getEmail(), saved.getName()));
        return authSessionService.open(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResource getMe(Long userId) {
        User user = findOrThrow(userRepository.findByIdWithRoles(userId), "User not found");
        return userMapper.toResource(user);
    }
}
