package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.modules.job.entities.JobDailyStat;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobDailyStatRepository extends JpaRepository<JobDailyStat, Long> {

    List<JobDailyStat> findByJobIdAndStatDateGreaterThanEqual(Long jobId, LocalDate from);

    // One statement keeps two flushes (or two nodes) from losing each other's increments.
    @Modifying
    @Query(
            value =
                    "INSERT INTO job_daily_stats (job_id, stat_date, views, created_at, updated_at)"
                            + " VALUES (:jobId, :day, :amount, NOW(6), NOW(6))"
                            + " ON DUPLICATE KEY UPDATE views = views + :amount, updated_at = NOW(6)",
            nativeQuery = true)
    void addViews(
            @Param("jobId") Long jobId, @Param("day") LocalDate day, @Param("amount") int amount);
}
