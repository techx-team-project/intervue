package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.UserTwoFactorRecoveryCode;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserTwoFactorRecoveryCodeRepository
        extends JpaRepository<UserTwoFactorRecoveryCode, Long> {

    List<UserTwoFactorRecoveryCode> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserTwoFactorRecoveryCode rc WHERE rc.userId = :userId")
    int deleteByUserId(@Param("userId") Long userId);
}
