package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.RecruiterRefreshToken;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterRefreshTokenRepository
        extends JpaRepository<RecruiterRefreshToken, Long> {

    Optional<RecruiterRefreshToken> findByTokenHash(String tokenHash);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM RecruiterRefreshToken t WHERE t.tokenHash = :tokenHash")
    Optional<RecruiterRefreshToken> findByTokenHashForUpdate(@Param("tokenHash") String tokenHash);

    @Modifying
    @Query(
            """
                UPDATE RecruiterRefreshToken t
                SET t.revoked = true, t.revokedAt = :now, t.revokedReason = :reason
                WHERE t.recruiterId = :recruiterId AND t.revoked = false
            """)
    int revokeAllByRecruiterId(
            @Param("recruiterId") Long recruiterId,
            @Param("now") Instant now,
            @Param("reason") String reason);

    @Modifying
    @Query(
            """
                UPDATE RecruiterRefreshToken t
                SET t.revoked = true, t.revokedAt = :now, t.revokedReason = :reason
                WHERE t.recruiterId = :recruiterId AND t.revoked = false AND t.id <> :keepId
            """)
    int revokeAllByRecruiterIdExcept(
            @Param("recruiterId") Long recruiterId,
            @Param("keepId") Long keepId,
            @Param("now") Instant now,
            @Param("reason") String reason);

    Optional<RecruiterRefreshToken> findByIdAndRecruiterId(Long id, Long recruiterId);

    List<RecruiterRefreshToken>
            findByRecruiterIdAndRevokedFalseAndExpiryDateAfterOrderByLastUsedAtDesc(
                    Long recruiterId, Instant now);
}
