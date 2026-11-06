package com.techx.intervue.modules.jobalert.repositories;

import com.techx.intervue.modules.jobalert.entities.JobAlert;
import com.techx.intervue.modules.jobalert.enums.AlertFrequency;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobAlertRepository extends JpaRepository<JobAlert, Long> {

    List<JobAlert> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<JobAlert> findByIdAndUserId(Long id, Long userId);

    Optional<JobAlert> findByUnsubscribeToken(String unsubscribeToken);

    long countByUserId(Long userId);

    long countByUserIdAndIsActiveTrue(Long userId);

    List<JobAlert> findAllByIsActiveTrueAndFrequency(AlertFrequency frequency);

    List<JobAlert> findAllByIsActiveTrue();
}
