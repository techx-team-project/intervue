package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    @EntityGraph(attributePaths = "skills")
    Optional<Job> findByIdAndRecruiterId(Long id, Long recruiterId);

    @EntityGraph(attributePaths = "screeningQuestions")
    Optional<Job> findWithScreeningQuestionsById(Long id);

    @EntityGraph(attributePaths = "skills")
    Optional<Job> findByIdAndStatus(Long id, JobStatus status);

    @EntityGraph(attributePaths = "skills")
    List<Job> findByIdInAndStatus(Collection<Long> ids, JobStatus status);

    @EntityGraph(attributePaths = "skills")
    @Query(
            "SELECT j FROM Job j WHERE j.status = :status AND j.deadline >= :today"
                    + " ORDER BY COALESCE(j.retoppedAt, j.publishedAt) DESC, j.id DESC")
    List<Job> findActiveWithSkills(
            @Param("status") JobStatus status, @Param("today") LocalDate today, Pageable pageable);

    @EntityGraph(attributePaths = "skills")
    @Query(
            "SELECT j FROM Job j WHERE j.status = :status AND j.deadline >= :today"
                    + " AND j.latitude BETWEEN :minLat AND :maxLat"
                    + " AND j.longitude BETWEEN :minLng AND :maxLng"
                    + " ORDER BY CASE WHEN j.boostLevel > 0 AND (j.boostExpiresAt IS NULL OR"
                    + " j.boostExpiresAt > :now) THEN j.boostLevel ELSE 0 END DESC,"
                    + " COALESCE(j.retoppedAt, j.publishedAt) DESC, j.id DESC")
    List<Job> findPublishedInBounds(
            @Param("status") JobStatus status,
            @Param("today") LocalDate today,
            @Param("minLat") BigDecimal minLat,
            @Param("maxLat") BigDecimal maxLat,
            @Param("minLng") BigDecimal minLng,
            @Param("maxLng") BigDecimal maxLng,
            @Param("now") Instant now,
            Pageable pageable);

    boolean existsByIdAndStatusAndDeadlineGreaterThanEqual(
            Long id, JobStatus status, LocalDate deadline);

    @Query(
            "SELECT j.status AS status, COUNT(j) AS total FROM Job j"
                    + " WHERE j.recruiterId = :recruiterId GROUP BY j.status")
    List<StatusCount> countByStatusForRecruiter(@Param("recruiterId") Long recruiterId);

    @Query("SELECT j.status AS status, COUNT(j) AS total FROM Job j GROUP BY j.status")
    List<StatusCount> countByStatus();

    @Query("SELECT j.id FROM Job j WHERE j.status IN :sources AND j.deadline < :today")
    List<Long> findOverdueIds(
            @Param("sources") Collection<JobStatus> sources, @Param("today") LocalDate today);

    @Modifying
    @Query(
            "UPDATE Job j SET j.status = :target, j.updatedAt = :now"
                    + " WHERE j.status IN :sources AND j.deadline < :today")
    int transitionOverdue(
            @Param("sources") Collection<JobStatus> sources,
            @Param("target") JobStatus target,
            @Param("today") LocalDate today,
            @Param("now") Instant now);

    interface StatusCount {
        JobStatus getStatus();

        long getTotal();
    }
}
