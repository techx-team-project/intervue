package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.RecruiterTwoFactor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterTwoFactorRepository extends JpaRepository<RecruiterTwoFactor, Long> {
    Optional<RecruiterTwoFactor> findByRecruiterId(Long recruiterId);
}
