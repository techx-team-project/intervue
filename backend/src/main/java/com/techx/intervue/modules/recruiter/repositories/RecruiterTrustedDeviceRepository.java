package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.RecruiterTrustedDevice;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterTrustedDeviceRepository
        extends JpaRepository<RecruiterTrustedDevice, Long> {

    Optional<RecruiterTrustedDevice> findByRecruiterIdAndDeviceTokenHash(
            Long recruiterId, String deviceTokenHash);

    List<RecruiterTrustedDevice> findAllByRecruiterIdOrderByLastUsedAtDesc(Long recruiterId);

    void deleteAllByRecruiterId(Long recruiterId);

    void deleteByIdAndRecruiterId(Long id, Long recruiterId);

    @Modifying
    @Query("DELETE FROM RecruiterTrustedDevice d WHERE d.expiresAt < :now")
    int deleteExpiredDevices(@Param("now") Instant now);
}
