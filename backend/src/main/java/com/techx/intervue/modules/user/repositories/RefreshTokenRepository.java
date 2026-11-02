package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.RefreshToken;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHash(String token);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RefreshToken r WHERE r.tokenHash = :token")
    Optional<RefreshToken> findByTokenHashForUpdate(String token);

    @Modifying
    @Transactional
    @Query(
            "UPDATE RefreshToken r SET r.revoked = true WHERE r.userId = :userId AND r.revoked = false")
    public void revokeAllRefreshTokenByUser(@Param(("userId")) Long userId);

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
