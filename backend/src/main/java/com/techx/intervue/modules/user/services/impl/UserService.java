package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.UserStatus;
import com.techx.intervue.modules.user.mappers.UserMapper;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.DeletionBlocker;
import com.techx.intervue.modules.user.services.interfaces.UserRegistrationServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import com.techx.intervue.services.impl.BaseService;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService extends BaseService implements UserServiceInterface {

    private final UserRepository userRepository;
    private final UserRegistrationServiceInterface userRegistrationService;
    private final AuthSessionServiceInterface authSessionService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final AuditLogServiceInterface auditLogService;
    private final List<DeletionBlocker> deletionBlockers;

    @Override
    @Transactional
    public AuthResult register(RegisterRequest request) {
        return userRegistrationService.register(request);
    }

    @Override
    @Transactional
    public AuthResult register(RegisterRequest request, String userAgent, String ip) {
        return userRegistrationService.register(request, userAgent, ip);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResource> findByIds(Collection<Long> userIds) {
        return userRepository.findAllById(userIds).stream().map(userMapper::toResource).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResource getMe(Long userId) {
        User user = findOrThrow(userRepository.findByIdWithRoles(userId), "User not found");
        return userMapper.toResource(user);
    }

    @Override
    @Transactional
    public void updateBasicInfo(Long userId, String name, String address) {
        User user = findOrThrow(userRepository.findById(userId), "User not found");
        user.setName(name.trim());
        String trimmedAddress = address == null ? "" : address.trim();
        user.setAddress(trimmedAddress.isEmpty() ? null : trimmedAddress);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void requestAccountDeletion(Long userId) {
        User user = findOrThrow(userRepository.findByIdWithRoles(userId), "User not found");
        if (user.getStatus() == UserStatus.DELETED) {
            throw new AppException(ErrorCode.ACCOUNT_DELETED);
        }
        if (user.getStatus() == UserStatus.PENDING_DELETION) {
            return;
        }

        for (DeletionBlocker blocker : deletionBlockers) {
            Optional<String> reason = blocker.checkBlocker(userId);
            if (reason.isPresent()) {
                throw new AppException(ErrorCode.DELETION_BLOCKED);
            }
        }

        user.setStatus(UserStatus.PENDING_DELETION);
        user.setDeleteRequestedAt(Instant.now());
        userRepository.save(user);

        refreshTokenRepository.revokeAllRefreshTokenByUser(user.getId());
        authSessionService.invalidate(userId);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(user.getId())
                        .actorEmail(user.getEmail())
                        .action(AuditAction.USER_DELETION_REQUESTED)
                        .targetType(AuditTargetType.USER)
                        .targetId(user.getId())
                        .reason("User requested account deletion (7-day grace period started)")
                        .build());
    }

    @Override
    @Transactional
    public UserResource cancelAccountDeletion(Long userId) {
        User user = findOrThrow(userRepository.findByIdWithRoles(userId), "User not found");
        if (user.getStatus() != UserStatus.PENDING_DELETION) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_PENDING_DELETION);
        }

        user.setStatus(UserStatus.ACTIVE);
        user.setDeleteRequestedAt(null);
        User saved = userRepository.save(user);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(user.getId())
                        .actorEmail(user.getEmail())
                        .action(AuditAction.USER_DELETION_CANCELLED)
                        .targetType(AuditTargetType.USER)
                        .targetId(user.getId())
                        .reason("User cancelled account deletion request")
                        .build());

        return userMapper.toResource(saved);
    }
}
