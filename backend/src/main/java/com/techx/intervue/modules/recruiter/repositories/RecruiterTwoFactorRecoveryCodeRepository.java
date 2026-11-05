package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.RecruiterTwoFactorRecoveryCode;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterTwoFactorRecoveryCodeRepository
        extends JpaRepository<RecruiterTwoFactorRecoveryCode, Long> {

    List<RecruiterTwoFactorRecoveryCode> findByRecruiterIdAndUsedAtIsNull(Long recruiterId);

    void deleteAllByRecruiterId(Long recruiterId);
}
