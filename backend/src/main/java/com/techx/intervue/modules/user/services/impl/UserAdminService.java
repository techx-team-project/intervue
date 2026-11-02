package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserRestriction;
import com.techx.intervue.modules.user.enums.RestrictionKind;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.UserStatus;
import com.techx.intervue.modules.user.mappers.AdminUserMapper;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.repositories.UserRestrictionRepository;
import com.techx.intervue.modules.user.repositories.UserSpecifications;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserAdminService implements UserAdminServiceInterface {

    private static final Set<String> SORTABLE_PROPERTIES =
            Set.of("id", "createdAt", "name", "email", "status", "lastLoginAt");
    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final Sort TIE_BREAKER = Sort.by(Sort.Direction.DESC, "id");
    private static final Duration STALE_WINDOW = Duration.ofDays(7);
    private static final Duration EXPIRING_GRANT_WINDOW = Duration.ofDays(14);

    private final UserRepository userRepository;
    private final UserRestrictionRepository userRestrictionRepository;
    private final RefreshTokenRepository refreshTokenRepository;
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
                .locked(byStatus.getOrDefault(UserStatus.LOCKED, 0L))
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
                .lockedOverAWeek(
                        userRestrictionRepository.countByKindAndLiftedAtIsNullAndCreatedAtBefore(
                                RestrictionKind.LOCK, staleBefore))
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
