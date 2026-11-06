package com.techx.intervue.modules.jobalert.repositories;

import com.techx.intervue.modules.jobalert.entities.JobAlertDelivery;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobAlertDeliveryRepository extends JpaRepository<JobAlertDelivery, Long> {

    @Query("SELECT d.jobId FROM JobAlertDelivery d WHERE d.alertId = :alertId")
    Set<String> findJobIdsByAlertId(@Param("alertId") Long alertId);

    boolean existsByAlertIdAndJobId(Long alertId, String jobId);
}
