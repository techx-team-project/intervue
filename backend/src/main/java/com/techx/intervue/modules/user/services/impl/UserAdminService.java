package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.repositories.AuditLogRepository;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.user.entities.RefreshToken;
import com.techx.intervue.modules.user.entities.Role;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserRestriction;
import com.techx.intervue.modules.user.entities.UserRole;
import com.techx.intervue.modules.user.entities.UserRole.UserRoleId;
import com.techx.intervue.modules.user.enums.RestrictionKind;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.TokenOrigin;
import com.techx.intervue.modules.user.enums.UserStatus;
import com.techx.intervue.modules.user.events.AccountRestrictedEvent;
import com.techx.intervue.modules.user.events.AccountRestrictionLiftedEvent;
import com.techx.intervue.modules.user.events.PasswordResetRequestedEvent;
import com.techx.intervue.modules.user.events.UserRolesChangedEvent;
import com.techx.intervue.modules.user.mappers.AdminUserMapper;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.RoleRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.repositories.UserRestrictionRepository;
import com.techx.intervue.modules.user.repositories.UserRoleRepository;
import com.techx.intervue.modules.user.repositories.UserSpecifications;
import com.techx.intervue.modules.user.repositories.UserTwoFactorRecoveryCodeRepository;
import com.techx.intervue.modules.user.repositories.UserTwoFactorRepository;
import com.techx.intervue.modules.user.requests.GrantUserRoleRequest;
import com.techx.intervue.modules.user.requests.LiftRestrictionRequest;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.requests.RevokeUserRoleRequest;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserActivityResource;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSessionResource;
import com.techx.intervue.modules.user.resources.AdminUserSignInResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import com.techx.intervue.modules.user.services.interfaces.DeletionBlocker;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserAdminService implements UserAdminServiceInterface {

    private static final Set<String> SORTABLE_PROPERTIES =
            Set.of("id", "createdAt", "name", "email", "status", "lastLoginAt");
    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final Sort TIE_BREAKER = Sort.by(Sort.Direction.DESC, "id");
    private static final Duration STALE_WINDOW = Duration.ofDays(7);
    private static final Duration EXPIRING_GRANT_WINDOW = Duration.ofDays(14);
    private static final int SWEEP_BATCH_SIZE = 200;

    private final UserRepository userRepository;
    private final UserRestrictionRepository userRestrictionRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserTwoFactorRepository userTwoFactorRepository;
    private final UserTwoFactorRecoveryCodeRepository userTwoFactorRecoveryCodeRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserSessionCacheInterface userSessionCache;
    private final AuditLogServiceInterface auditLogService;
    private final AuditLogRepository auditLogRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final AdminUserMapper adminUserMapper;
    private final List<DeletionBlocker> deletionBlockers;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserListResource> search(SearchUsersRequest request, Pageable pageable) {
        verifySortable(pageable.getSort());
        Pageable ordered = withStableOrder(pageable);

        Page<User> page = userRepository.findAll(UserSpecifications.matching(request), ordered);
        List<Long> ids = page.map(User::getId).getContent();
        if (ids.isEmpty()) {
            return new PageImpl<>(List.of(), ordered, page.getTotalElements());
        }

        Map<Long, User> withRoles =
                userRepository.findAllWithRolesByIds(ids).stream()
                        .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<Long, Long> sessionCounts = activeSessionCounts(ids);
        Map<Long, UserRestriction> restrictions = standingRestrictions(ids);
        Set<Long> tokenReuseUserIds =
                auditLogRepository.findTargetIdsByTargetTypeAndTargetIdInAndAction(
                        AuditTargetType.USER, ids, AuditAction.TOKEN_REUSE_DETECTED);
        Set<Long> twoFactorUserIds = userTwoFactorRepository.findUserIdsWithActiveTwoFactor(ids);

        List<AdminUserListResource> items =
                ids.stream()
                        .map(
                                id ->
                                        adminUserMapper.toListResource(
                                                withRoles.get(id),
                                                sessionCounts.getOrDefault(id, 0L),
                                                tokenReuseUserIds.contains(id),
                                                twoFactorUserIds.contains(id),
                                                restrictions.get(id)))
                        .toList();

        return new PageImpl<>(items, ordered, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserDetailResource findDetail(Long userId) {
        User user =
                userRepository
                        .findByIdWithRoles(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        return detailOf(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserSummaryResource summarise() {
        Instant now = Instant.now();
        Instant staleBefore = now.minus(STALE_WINDOW);

        Map<UserStatus, Long> byStatus = new EnumMap<>(UserStatus.class);
        userRepository
                .countGroupedByStatus()
                .forEach(row -> byStatus.put(row.getStatus(), row.getTotal()));

        Map<RoleType, Long> byRole = new EnumMap<>(RoleType.class);
        userRepository
                .countGroupedByActiveRole(now)
                .forEach(row -> byRole.put(row.getRole(), row.getTotal()));

        long total = byStatus.values().stream().mapToLong(Long::longValue).sum();

        return AdminUserSummaryResource.builder()
                .total(total)
                .active(byStatus.getOrDefault(UserStatus.ACTIVE, 0L))
                .banned(byStatus.getOrDefault(UserStatus.BANNED, 0L))
                .unverified(userRepository.countByEmailVerifiedAtIsNull())
                .newLast7Days(userRepository.countByCreatedAtAfter(staleBefore))
                .activeLast7Days(userRepository.countByLastLoginAtAfter(staleBefore))
                .candidates(byRole.getOrDefault(RoleType.CANDIDATE, 0L))
                .recruiters(byRole.getOrDefault(RoleType.RECRUITER, 0L))
                .admins(byRole.getOrDefault(RoleType.ADMIN, 0L))
                .activeAdminCount(
                        userRepository.countByStatusAndActiveRole(
                                UserStatus.ACTIVE, RoleType.ADMIN, now))
                .bannedOverAWeek(
                        userRestrictionRepository.countByKindAndLiftedAtIsNullAndCreatedAtBefore(
                                RestrictionKind.BAN, staleBefore))
                .unverifiedOverAWeek(
                        userRepository.countByEmailVerifiedAtIsNullAndCreatedAtBefore(staleBefore))
                .grantsExpiringIn14Days(
                        userRepository.countWithGrantsExpiringBetween(
                                now, now.plus(EXPIRING_GRANT_WINDOW)))
                .build();
    }

    // Seeded accounts share a created_at, and an unstable order would let the same
    // row show up on two pages, so every sort ends with the primary key.
    private Pageable withStableOrder(Pageable pageable) {
        Sort requested = pageable.getSort().isSorted() ? pageable.getSort() : DEFAULT_SORT;
        return PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), requested.and(TIE_BREAKER));
    }

    @Override
    @Transactional
    public AdminUserDetailResource restrict(
            Long userId, RestrictUserRequest request, AdminActor actor) {
        User target = loadWithRoles(userId);
        guardRestriction(target, actor);

        UserRestriction restriction =
                userRestrictionRepository.save(
                        UserRestriction.builder()
                                .userId(target.getId())
                                .kind(RestrictionKind.BAN)
                                .reason(request.reason())
                                .detail(request.detail())
                                .notifyUser(request.notifyUser())
                                .createdBy(userRepository.getReferenceById(actor.id()))
                                .expiresAt(request.expiresAt())
                                .build());

        target.setStatus(RestrictionKind.BAN.getStatus());
        userRepository.save(target);
        endEverySession(target.getId());

        audit(
                RestrictionKind.BAN.getAppliedAction(),
                target,
                actor,
                request.reason(),
                request.detail());
        if (request.notifyUser()) {
            eventPublisher.publishEvent(
                    new AccountRestrictedEvent(
                            target.getId(),
                            target.getEmail(),
                            target.getName(),
                            request.reason(),
                            request.expiresAt()));
        }
        return detailOf(target, restriction);
    }

    @Override
    @Transactional
    public AdminUserDetailResource liftRestriction(
            Long userId, LiftRestrictionRequest request, AdminActor actor) {
        User target = loadWithRoles(userId);
        UserRestriction standing =
                userRestrictionRepository
                        .findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_RESTRICTED));

        standing.setLiftedAt(Instant.now());
        standing.setLiftedBy(userRepository.getReferenceById(actor.id()));
        standing.setLiftReason(request.reason());
        userRestrictionRepository.save(standing);

        target.setStatus(UserStatus.ACTIVE);
        userRepository.save(target);

        audit(RestrictionKind.BAN.getLiftedAction(), target, actor, request.reason(), null);
        if (standing.isNotifyUser()) {
            notifyLifted(target);
        }
        return detailOf(target, null);
    }

    @Override
    @Transactional
    @Scheduled(fixedDelay = 5, timeUnit = TimeUnit.MINUTES)
    public int liftExpiredRestrictions() {
        Instant now = Instant.now();
        List<UserRestriction> expired =
                userRestrictionRepository.findStandingExpired(
                        now, PageRequest.of(0, SWEEP_BATCH_SIZE));
        if (expired.isEmpty()) {
            return 0;
        }

        Map<Long, User> owners =
                userRepository
                        .findAllById(expired.stream().map(UserRestriction::getUserId).toList())
                        .stream()
                        .collect(Collectors.toMap(User::getId, Function.identity()));

        expired.forEach(
                restriction -> {
                    restriction.setLiftedAt(now);
                    User owner = owners.get(restriction.getUserId());
                    if (owner != null) {
                        owner.setStatus(UserStatus.ACTIVE);
                        if (restriction.isNotifyUser()) {
                            notifyLifted(owner);
                        }
                    }
                    auditLogService.record(
                            AuditEntry.builder()
                                    .actorType(AuditActorType.SYSTEM)
                                    .action(AuditAction.USER_RESTRICTION_EXPIRED)
                                    .targetType(AuditTargetType.USER)
                                    .targetId(restriction.getUserId())
                                    .build());
                });

        userRestrictionRepository.saveAll(expired);
        userRepository.saveAll(owners.values());
        log.info("Lifted {} expired account restrictions", expired.size());
        return expired.size();
    }

    private void notifyLifted(User target) {
        eventPublisher.publishEvent(
                new AccountRestrictionLiftedEvent(
                        target.getId(), target.getEmail(), target.getName()));
    }

    private User loadWithRoles(Long userId) {
        return userRepository
                .findByIdWithRoles(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void guardRestriction(User target, AdminActor actor) {
        if (target.getId().equals(actor.id())) {
            throw new AppException(ErrorCode.CANNOT_RESTRICT_SELF);
        }
        if (userRestrictionRepository
                .findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(target.getId())
                .isPresent()) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_RESTRICTED);
        }
        boolean lastWayIn =
                target.getStatus() == UserStatus.ACTIVE
                        && target.activeRoleTypes().contains(RoleType.ADMIN)
                        && userRepository.countByStatusAndActiveRole(
                                        UserStatus.ACTIVE, RoleType.ADMIN, Instant.now())
                                <= 1;
        if (lastWayIn) {
            throw new AppException(ErrorCode.LAST_ACTIVE_ADMIN);
        }
    }

    // Dropping the Redis session entry rejects the live access token on the next
    // request, so the account is out immediately instead of after the token expires.
    private void endEverySession(Long userId) {
        userSessionCache.evict(userId);
        refreshTokenRepository.revokeAllRefreshTokenByUser(userId);
    }

    private void audit(
            AuditAction action, User target, AdminActor actor, String reason, String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.id())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.USER)
                        .targetId(target.getId())
                        .reason(reason)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }

    private AdminUserDetailResource detailOf(User target, UserRestriction restriction) {
        boolean hasTokenReuseIncident =
                auditLogRepository.existsByTargetTypeAndTargetIdAndAction(
                        AuditTargetType.USER, target.getId(), AuditAction.TOKEN_REUSE_DETECTED);
        boolean twoFactorEnabled =
                userTwoFactorRepository.existsByUserIdAndConfirmedAtIsNotNull(target.getId());
        return adminUserMapper.toDetailResource(
                target,
                activeSessionCounts(List.of(target.getId())).getOrDefault(target.getId(), 0L),
                hasTokenReuseIncident,
                twoFactorEnabled,
                restriction);
    }

    private AdminUserDetailResource detailOf(User target) {
        UserRestriction standing =
                userRestrictionRepository
                        .findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(target.getId())
                        .orElse(null);
        return detailOf(target, standing);
    }

    private void verifySortable(Sort sort) {
        sort.forEach(
                order -> {
                    if (!SORTABLE_PROPERTIES.contains(order.getProperty())) {
                        throw AppException.validation(
                                "sort", "Cannot sort users by " + order.getProperty());
                    }
                });
    }

    private Map<Long, Long> activeSessionCounts(Collection<Long> ids) {
        Map<Long, Long> counts = new HashMap<>();
        refreshTokenRepository
                .countActiveSessionsByUserIds(ids, Instant.now())
                .forEach(row -> counts.put(row.getUserId(), row.getSessionCount()));
        return counts;
    }

    private Map<Long, UserRestriction> standingRestrictions(Collection<Long> ids) {
        Map<Long, UserRestriction> standing = new HashMap<>();
        userRestrictionRepository
                .findStandingByUserIds(ids)
                .forEach(restriction -> standing.putIfAbsent(restriction.getUserId(), restriction));
        return standing;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserActivityResource> findActivities(Long userId, Pageable pageable) {
        User target =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        Pageable stablePageable = withStableOrder(pageable);
        Page<AuditLog> logs =
                auditLogRepository.findByTargetTypeAndTargetId(
                        AuditTargetType.USER, target.getId(), stablePageable);

        Set<Long> actorIds =
                logs.getContent().stream()
                        .map(AuditLog::getActorId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

        Map<Long, String> actorNames =
                actorIds.isEmpty()
                        ? Map.of()
                        : userRepository.findAllById(actorIds).stream()
                                .collect(Collectors.toMap(User::getId, User::getName));

        return logs.map(log -> toActivityResource(log, actorNames));
    }

    private AdminUserActivityResource toActivityResource(
            AuditLog log, Map<Long, String> actorNames) {
        String actorName = null;
        if (log.getActorType() == AuditActorType.SYSTEM) {
            actorName = "System";
        } else if (log.getActorId() != null && actorNames.containsKey(log.getActorId())) {
            actorName = actorNames.get(log.getActorId());
        } else if (log.getActorEmail() != null) {
            actorName = log.getActorEmail();
        }

        String kind = mapActionToActivityKind(log.getAction());
        String summary = mapActionToSummary(log.getAction(), log.getDetail());

        return AdminUserActivityResource.builder()
                .id(log.getId())
                .kind(kind)
                .summary(summary)
                .actorName(actorName)
                .reason(log.getReason())
                .at(log.getCreatedAt())
                .build();
    }

    private String mapActionToActivityKind(AuditAction action) {
        return switch (action) {
            case USER_BANNED -> "banned";
            case USER_UNBANNED, USER_RESTRICTION_EXPIRED -> "unbanned";
            case USER_REGISTERED -> "accountCreated";
            case EMAIL_VERIFIED -> "emailVerified";
            case ROLE_GRANTED -> "roleGranted";
            case ROLE_REVOKED -> "roleRevoked";
            case SESSIONS_REVOKED -> "sessionsRevoked";
            case TWO_FACTOR_RESET -> "twoFactorReset";
            case PASSWORD_RESET_SENT -> "passwordResetSent";
            case TOKEN_REUSE_DETECTED -> "tokenReuseDetected";
            case USER_DELETION_REQUESTED -> "deletionRequested";
            case USER_DELETION_CANCELLED -> "deletionCancelled";
            case USER_RESTORED -> "accountRestored";
            case USER_PURGED -> "accountPurged";
        };
    }

    private String mapActionToSummary(AuditAction action, String detail) {
        return switch (action) {
            case USER_BANNED ->
                    detail != null && !detail.isBlank()
                            ? "Account banned: " + detail
                            : "Account banned";
            case USER_UNBANNED -> "Account unbanned";
            case USER_RESTRICTION_EXPIRED -> "Account ban expired";
            case USER_REGISTERED -> "Account registered";
            case EMAIL_VERIFIED -> "Email address verified";
            case ROLE_GRANTED ->
                    detail != null && !detail.isBlank()
                            ? "Role granted: " + detail
                            : "Role granted";
            case ROLE_REVOKED ->
                    detail != null && !detail.isBlank()
                            ? "Role revoked: " + detail
                            : "Role revoked";
            case SESSIONS_REVOKED -> "All sessions revoked";
            case TWO_FACTOR_RESET -> "Two-factor authentication reset";
            case PASSWORD_RESET_SENT -> "Password reset link sent";
            case TOKEN_REUSE_DETECTED ->
                    "Revoked refresh token presented again — every session was revoked";
            case USER_DELETION_REQUESTED ->
                    "Account deletion requested (7-day grace period started)";
            case USER_DELETION_CANCELLED -> "Account deletion request cancelled";
            case USER_RESTORED -> "Account restored";
            case USER_PURGED -> "Account permanently purged and anonymized";
        };
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserSessionResource> findSessions(Long userId) {
        User target =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        List<RefreshToken> activeTokens =
                refreshTokenRepository
                        .findByUserIdAndRevokedFalseAndExpiryDateAfterOrderByCreatedAtDesc(
                                target.getId(), Instant.now());

        List<AdminUserSessionResource> sessions = new ArrayList<>(activeTokens.size());
        for (int i = 0; i < activeTokens.size(); i++) {
            RefreshToken r = activeTokens.get(i);
            sessions.add(
                    AdminUserSessionResource.builder()
                            .id(r.getId())
                            .createdAt(r.getCreatedAt())
                            .expiresAt(r.getExpiryDate())
                            .revoked(r.isRevoked())
                            .replacedByTokenId(r.getReplacedByTokenId())
                            .deviceLabel(
                                    r.getDeviceLabel() != null
                                            ? r.getDeviceLabel()
                                            : "Unknown Device")
                            .ipAddress(r.getIp() != null ? r.getIp() : "Unknown")
                            .isCurrent(i == 0)
                            .build());
        }
        return sessions;
    }

    @Override
    @Transactional
    public void revokeSession(Long userId, Long sessionId, AdminActor actor) {
        User target =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        RefreshToken session =
                refreshTokenRepository
                        .findByIdAndUserId(sessionId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (!session.isRevoked()) {
            session.setRevoked(true);
            session.setRevokedAt(Instant.now());
            session.setRevokedReason("ADMIN_REVOKED");
            refreshTokenRepository.save(session);

            audit(
                    AuditAction.SESSIONS_REVOKED,
                    target,
                    actor,
                    "Session #" + sessionId + " revoked by admin",
                    null);
        }
    }

    @Override
    @Transactional
    public void revokeAllSessions(Long userId, AdminActor actor) {
        User target =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        refreshTokenRepository.revokeAllByUserId(userId, Instant.now(), "ADMIN_REVOKE_ALL");
        userSessionCache.evict(userId);

        audit(AuditAction.SESSIONS_REVOKED, target, actor, "All sessions revoked by admin", null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserSignInResource> findSignIns(Long userId, Pageable pageable) {
        User target =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        Pageable ordered = withStableOrder(pageable);
        return refreshTokenRepository
                .findByUserIdAndOrigin(target.getId(), TokenOrigin.SIGN_IN, ordered)
                .map(
                        r ->
                                AdminUserSignInResource.builder()
                                        .id(r.getId())
                                        .at(r.getCreatedAt())
                                        .deviceLabel(
                                                r.getDeviceLabel() != null
                                                        ? r.getDeviceLabel()
                                                        : "Unknown Device")
                                        .ipAddress(r.getIp() != null ? r.getIp() : "Unknown")
                                        .location(
                                                r.getLocation() != null
                                                        ? r.getLocation()
                                                        : "Unknown Location")
                                        .outcome(r.isRevoked() ? "revoked" : "success")
                                        .build());
    }

    @Override
    @Transactional
    public AdminUserDetailResource grantRole(
            Long userId, GrantUserRoleRequest request, AdminActor actor) {
        User target = loadWithRoles(userId);

        RoleType roleType = request.role();
        if (target.activeRoleTypes().contains(roleType)) {
            throw new AppException(ErrorCode.ROLE_ALREADY_GRANTED);
        }

        if (request.expiresAt() != null && !request.expiresAt().isAfter(Instant.now())) {
            throw AppException.validation("expiresAt", "Expiry date must be in the future");
        }

        Role role =
                roleRepository
                        .findByName(roleType)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        User actorRef = userRepository.findById(actor.id()).orElse(null);

        Optional<UserRole> existingGrant =
                target.getUserRoles().stream()
                        .filter(ur -> ur.getRole().getName() == roleType)
                        .findFirst();

        if (existingGrant.isPresent()) {
            UserRole ur = existingGrant.get();
            ur.setGrantedBy(actorRef);
            ur.setGrantedAt(Instant.now());
            ur.setExpiresAt(request.expiresAt());
        } else {
            UserRole newGrant =
                    UserRole.builder()
                            .id(new UserRoleId(target.getId(), role.getId()))
                            .user(target)
                            .role(role)
                            .grantedBy(actorRef)
                            .grantedAt(Instant.now())
                            .expiresAt(request.expiresAt())
                            .build();
            target.getUserRoles().add(newGrant);
        }

        userRepository.save(target);

        String detail =
                request.expiresAt() != null
                        ? roleType.name() + " (expires " + request.expiresAt() + ")"
                        : roleType.name();
        audit(AuditAction.ROLE_GRANTED, target, actor, request.reason(), detail);

        eventPublisher.publishEvent(new UserRolesChangedEvent(target.getId()));

        return detailOf(target);
    }

    @Override
    @Transactional
    public AdminUserDetailResource revokeRole(
            Long userId, RoleType roleType, RevokeUserRoleRequest request, AdminActor actor) {
        User target = loadWithRoles(userId);

        if (!target.activeRoleTypes().contains(roleType)) {
            throw new AppException(ErrorCode.ROLE_NOT_ASSIGNED);
        }

        if (target.getId().equals(actor.id()) && roleType == RoleType.ADMIN) {
            throw new AppException(ErrorCode.CANNOT_REMOVE_SELF_ADMIN);
        }

        if (roleType == RoleType.ADMIN
                && target.getStatus() == UserStatus.ACTIVE
                && userRepository.countByStatusAndActiveRole(
                                UserStatus.ACTIVE, RoleType.ADMIN, Instant.now())
                        <= 1) {
            throw new AppException(ErrorCode.LAST_ACTIVE_ADMIN);
        }

        if (target.activeRoleTypes().size() <= 1) {
            throw new AppException(ErrorCode.CANNOT_REMOVE_LAST_ROLE);
        }

        target.getUserRoles().removeIf(ur -> ur.getRole().getName() == roleType);
        userRepository.save(target);

        String reason = request != null ? request.reason() : null;
        audit(AuditAction.ROLE_REVOKED, target, actor, reason, roleType.name());

        eventPublisher.publishEvent(new UserRolesChangedEvent(target.getId()));

        return detailOf(target);
    }

    @Override
    @Transactional
    @Scheduled(fixedDelay = 5, timeUnit = TimeUnit.MINUTES)
    public int sweepExpiredRoleGrants() {
        Instant now = Instant.now();
        Instant windowStart = now.minus(15, ChronoUnit.MINUTES);
        List<UserRole> recentlyExpired =
                userRoleRepository.findRecentlyExpiredGrants(windowStart, now);
        for (UserRole grant : recentlyExpired) {
            userSessionCache.evict(grant.getUser().getId());
        }
        if (!recentlyExpired.isEmpty()) {
            log.info(
                    "Evicted session cache for {} users with expired role grants",
                    recentlyExpired.size());
        }
        return recentlyExpired.size();
    }

    @Override
    @Transactional
    public AdminUserDetailResource resetTwoFactor(Long userId, AdminActor actor) {
        User target = loadWithRoles(userId);

        userTwoFactorRepository.deleteByUserId(target.getId());
        userTwoFactorRecoveryCodeRepository.deleteByUserId(target.getId());

        audit(
                AuditAction.TWO_FACTOR_RESET,
                target,
                actor,
                "Two-factor authentication reset by admin",
                null);

        return detailOf(target);
    }

    @Override
    @Transactional
    public AdminUserDetailResource sendPasswordReset(Long userId, AdminActor actor) {
        User target = loadWithRoles(userId);

        if (!target.isEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        eventPublisher.publishEvent(
                new PasswordResetRequestedEvent(
                        target.getId(), target.getEmail(), target.getName()));

        audit(
                AuditAction.PASSWORD_RESET_SENT,
                target,
                actor,
                "Password reset email sent by admin",
                null);

        return detailOf(target);
    }

    @Override
    @Transactional
    public AdminUserDetailResource cancelDeletion(Long userId, AdminActor actor) {
        User target = loadWithRoles(userId);
        if (target.getStatus() != UserStatus.PENDING_DELETION) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_PENDING_DELETION);
        }

        target.setStatus(UserStatus.ACTIVE);
        target.setDeleteRequestedAt(null);
        userRepository.save(target);

        audit(
                AuditAction.USER_DELETION_CANCELLED,
                target,
                actor,
                "Cancelled account deletion request by admin",
                null);

        return detailOf(target);
    }

    @Override
    @Transactional
    public AdminUserDetailResource restoreUser(Long userId, AdminActor actor) {
        User target = loadWithRoles(userId);
        if (target.getStatus() == UserStatus.PENDING_DELETION) {
            return cancelDeletion(userId, actor);
        }
        if (target.getStatus() == UserStatus.BANNED) {
            return liftRestriction(userId, new LiftRestrictionRequest("Restored by admin"), actor);
        }
        return detailOf(target);
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 2 * * *")
    public int purgeExpiredPendingDeletions() {
        Instant cutoff = Instant.now().minus(7, ChronoUnit.DAYS);
        List<User> expired =
                userRepository.findPendingDeletionsExpired(
                        UserStatus.PENDING_DELETION, cutoff, PageRequest.of(0, SWEEP_BATCH_SIZE));
        if (expired.isEmpty()) {
            return 0;
        }

        int purgedCount = 0;
        for (User user : expired) {
            boolean blocked = false;
            for (DeletionBlocker blocker : deletionBlockers) {
                Optional<String> reason = blocker.checkBlocker(user.getId());
                if (reason.isPresent()) {
                    log.warn("Purge blocked for user {}: {}", user.getId(), reason.get());
                    blocked = true;
                    break;
                }
            }
            if (blocked) {
                continue;
            }

            user.setStatus(UserStatus.DELETED);
            user.setDeletedAt(Instant.now());
            user.setName("Deleted User");
            user.setEmail(
                    "deleted_"
                            + user.getId()
                            + "_"
                            + System.currentTimeMillis()
                            + "@deleted.local");
            user.setPhone(null);
            user.setAddress(null);
            user.setImage(null);
            user.setPassword("$disabled$" + UUID.randomUUID());
            userRepository.save(user);

            refreshTokenRepository.revokeAllRefreshTokenByUser(user.getId());
            userSessionCache.evict(user.getId());
            userTwoFactorRepository.deleteByUserId(user.getId());
            userTwoFactorRecoveryCodeRepository.deleteByUserId(user.getId());

            auditLogService.record(
                    AuditEntry.builder()
                            .actorType(AuditActorType.SYSTEM)
                            .actorId(null)
                            .actorEmail("system")
                            .action(AuditAction.USER_PURGED)
                            .targetType(AuditTargetType.USER)
                            .targetId(user.getId())
                            .reason("Account anonymized and deactivated after 7-day grace period")
                            .build());
            purgedCount++;
        }
        if (purgedCount > 0) {
            log.info("Purged {} expired pending-deletion accounts", purgedCount);
        }
        return purgedCount;
    }
}
