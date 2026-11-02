package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.UserRole;
import com.techx.intervue.modules.user.entities.UserRole.UserRoleId;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

    @Modifying
    @Transactional
    @Query("DELETE FROM UserRole ur WHERE ur.user.id = :userId AND ur.role.id = :roleId")
    int deleteByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);

    @Query(
            """
                SELECT ur FROM UserRole ur
                WHERE ur.expiresAt IS NOT NULL
                  AND ur.expiresAt > :from
                  AND ur.expiresAt <= :to
            """)
    List<UserRole> findRecentlyExpiredGrants(@Param("from") Instant from, @Param("to") Instant to);
}
