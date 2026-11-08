package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.RecruiterSocialAccount;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RecruiterSocialAccountRepository
        extends JpaRepository<RecruiterSocialAccount, Long> {

    Optional<RecruiterSocialAccount> findByProviderAndProviderSubject(
            OAuthProvider provider, String providerSubject);

    @Modifying
    @Transactional
    @Query("DELETE FROM RecruiterSocialAccount a WHERE a.recruiterId = :recruiterId")
    int deleteByRecruiterId(@Param("recruiterId") Long recruiterId);
}
