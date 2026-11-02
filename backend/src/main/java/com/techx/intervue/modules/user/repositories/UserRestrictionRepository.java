package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.UserRestriction;
import com.techx.intervue.modules.user.enums.RestrictionKind;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRestrictionRepository extends JpaRepository<UserRestriction, Long> {

    @Query(
            """
                SELECT r FROM UserRestriction r
                LEFT JOIN FETCH r.createdBy c
                WHERE r.userId IN :ids AND r.liftedAt IS NULL
                ORDER BY r.createdAt DESC
            """)
    List<UserRestriction> findStandingByUserIds(@Param("ids") Collection<Long> ids);

    Optional<UserRestriction> findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(Long userId);

    long countByKindAndLiftedAtIsNullAndCreatedAtBefore(RestrictionKind kind, Instant before);
}
