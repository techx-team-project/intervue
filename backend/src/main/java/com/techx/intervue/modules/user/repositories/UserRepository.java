package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.UserStatus;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    boolean existsByPhoneAndIdNot(String phone, Long id);

    Optional<User> findByEmail(String email);

    @Query(
            """
                SELECT DISTINCT u FROM User u
                LEFT JOIN FETCH u.userRoles ur
                LEFT JOIN FETCH ur.role r
                WHERE u.email = :email
            """)
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    @Query(
            """
                SELECT DISTINCT u FROM User u
                LEFT JOIN FETCH u.userRoles ur
                LEFT JOIN FETCH ur.role r
                LEFT JOIN FETCH ur.grantedBy g
                WHERE u.id = :id
            """)
    Optional<User> findByIdWithRoles(@Param("id") Long id);

    @Query(
            """
                SELECT DISTINCT u FROM User u
                LEFT JOIN FETCH u.userRoles ur
                LEFT JOIN FETCH ur.role r
                LEFT JOIN FETCH ur.grantedBy g
                WHERE u.id IN :ids
            """)
    List<User> findAllWithRolesByIds(@Param("ids") Collection<Long> ids);

    boolean existsByEmail(String email);

    interface StatusCount {
        UserStatus getStatus();

        long getTotal();
    }

    interface RoleCount {
        RoleType getRole();

        long getTotal();
    }

    @Query("SELECT u.status AS status, COUNT(u) AS total FROM User u GROUP BY u.status")
    List<StatusCount> countGroupedByStatus();

    @Query(
            """
                SELECT r.name AS role, COUNT(DISTINCT u.id) AS total
                FROM User u JOIN u.userRoles ur JOIN ur.role r
                WHERE ur.expiresAt IS NULL OR ur.expiresAt > :now
                GROUP BY r.name
            """)
    List<RoleCount> countGroupedByActiveRole(@Param("now") Instant now);

    @Query(
            """
                SELECT COUNT(DISTINCT u.id)
                FROM User u JOIN u.userRoles ur JOIN ur.role r
                WHERE u.status = :status AND r.name = :role
                  AND (ur.expiresAt IS NULL OR ur.expiresAt > :now)
            """)
    long countByStatusAndActiveRole(
            @Param("status") UserStatus status,
            @Param("role") RoleType role,
            @Param("now") Instant now);

    @Query(
            """
                SELECT DISTINCT u.id
                FROM User u JOIN u.userRoles ur JOIN ur.role r
                WHERE u.status = :status AND r.name = :role
                  AND (ur.expiresAt IS NULL OR ur.expiresAt > :now)
            """)
    List<Long> findIdsByStatusAndActiveRole(
            @Param("status") UserStatus status,
            @Param("role") RoleType role,
            @Param("now") Instant now);

    @Query(
            """
                SELECT COUNT(DISTINCT u.id) FROM User u JOIN u.userRoles ur
                WHERE ur.expiresAt > :from AND ur.expiresAt <= :to
            """)
    long countWithGrantsExpiringBetween(@Param("from") Instant from, @Param("to") Instant to);

    long countByEmailVerifiedAtIsNull();

    long countByCreatedAtAfter(Instant since);

    long countByLastLoginAtAfter(Instant since);

    long countByEmailVerifiedAtIsNullAndCreatedAtBefore(Instant before);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLoginAt = :at WHERE u.id = :id")
    void touchLastLogin(@Param("id") Long id, @Param("at") Instant at);

    @Query(
            """
                SELECT u FROM User u
                WHERE u.status = :status AND u.deleteRequestedAt <= :cutoff
            """)
    List<User> findPendingDeletionsExpired(
            @Param("status") UserStatus status, @Param("cutoff") Instant cutoff, Pageable pageable);
}
