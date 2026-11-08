package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.UserSocialAccount;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserSocialAccountRepository extends JpaRepository<UserSocialAccount, Long> {

    Optional<UserSocialAccount> findByProviderAndProviderSubject(
            OAuthProvider provider, String providerSubject);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserSocialAccount a WHERE a.userId = :userId")
    int deleteByUserId(@Param("userId") Long userId);
}
