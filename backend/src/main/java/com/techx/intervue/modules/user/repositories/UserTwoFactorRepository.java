package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.UserTwoFactor;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserTwoFactorRepository extends JpaRepository<UserTwoFactor, Long> {

    Optional<UserTwoFactor> findByUserId(Long userId);

    boolean existsByUserIdAndConfirmedAtIsNotNull(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserTwoFactor utf WHERE utf.userId = :userId")
    int deleteByUserId(@Param("userId") Long userId);

    @Query(
            """
                SELECT utf.userId FROM UserTwoFactor utf
                WHERE utf.userId IN :userIds AND utf.confirmedAt IS NOT NULL
            """)
    Set<Long> findUserIdsWithActiveTwoFactor(@Param("userIds") Collection<Long> userIds);
}
