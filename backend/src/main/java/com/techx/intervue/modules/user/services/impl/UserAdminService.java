package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserRestriction;
import com.techx.intervue.modules.user.enums.RestrictionKind;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.UserStatus;
import com.techx.intervue.modules.user.events.AccountRestrictedEvent;
import com.techx.intervue.modules.user.events.AccountRestrictionLiftedEvent;
import com.techx.intervue.modules.user.mappers.AdminUserMapper;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.repositories.UserRestrictionRepository;
import com.techx.intervue.modules.user.repositories.UserSpecifications;
import com.techx.intervue.modules.user.requests.LiftRestrictionRequest;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserSessionCacheInterface userSessionCache;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;
    private final AdminUserMapper adminUserMapper;

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

        List<AdminUserListResource> items =
                ids.stream()
                        .map(
                                id ->
                                        adminUserMapper.toListResource(
                                                withRoles.get(id),
                                                sessionCounts.getOrDefault(id, 0L),
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

        return adminUserMapper.toDetailResource(
                user,
                activeSessionCounts(List.of(userId)).getOrDefault(userId, 0L),
                userRestrictionRepository
                        .findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(userId)
                        .orElse(null));
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
        return adminUserMapper.toDetailResource(
                target,
                activeSessionCounts(List.of(target.getId())).getOrDefault(target.getId(), 0L),
                restriction);
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
}
