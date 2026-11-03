package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.RefreshToken;
import com.techx.intervue.modules.user.enums.TokenOrigin;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String token);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RefreshToken r WHERE r.tokenHash = :token")
    Optional<RefreshToken> findByTokenHashForUpdate(String token);

    @Modifying
    @Transactional
    @Query(
            """
                UPDATE RefreshToken r
                SET r.revoked = true, r.revokedAt = :now, r.revokedReason = :reason
                WHERE r.userId = :userId AND r.revoked = false
            """)
    int revokeAllByUserId(
            @Param("userId") Long userId,
            @Param("now") Instant now,
            @Param("reason") String reason);

    @Modifying
    @Transactional
    @Query(
            """
                UPDATE RefreshToken r
                SET r.revoked = true, r.revokedAt = CURRENT_TIMESTAMP, r.revokedReason = 'REVOKED'
                WHERE r.userId = :userId AND r.revoked = false
            """)
    void revokeAllRefreshTokenByUser(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE RefreshToken r SET r.location = :location WHERE r.id = :id")
    int updateLocation(@Param("id") Long id, @Param("location") String location);

    Optional<RefreshToken> findByIdAndUserId(Long id, Long userId);

    List<RefreshToken> findByUserIdAndRevokedFalseAndExpiryDateAfterOrderByCreatedAtDesc(
            Long userId, Instant now);

    Page<RefreshToken> findByUserId(Long userId, Pageable pageable);

    Page<RefreshToken> findByUserIdAndOrigin(Long userId, TokenOrigin origin, Pageable pageable);

    Long deleteByExpiryDateBefore(Instant now);

    interface ActiveSessionCount {
        Long getUserId();

        long getSessionCount();
    }

    @Query(
            """
                SELECT r.userId AS userId, COUNT(r) AS sessionCount
                FROM RefreshToken r
                WHERE r.userId IN :ids AND r.revoked = false AND r.expiryDate > :now
                GROUP BY r.userId
            """)
    List<ActiveSessionCount> countActiveSessionsByUserIds(
            @Param("ids") Collection<Long> ids, @Param("now") Instant now);
}
