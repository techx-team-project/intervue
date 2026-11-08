package com.techx.intervue.modules.application.repositories;

import com.techx.intervue.modules.application.entities.Interview;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByIdAndCompanyId(Long id, Long companyId);

    Optional<Interview> findByIdAndCandidateId(Long id, Long candidateId);

    boolean existsByApplicationIdAndStatusIn(
            Long applicationId, Collection<InterviewStatus> statuses);

    List<Interview> findByApplicationIdAndCompanyIdOrderByCreatedAtDescIdDesc(
            Long applicationId, Long companyId);

    Page<Interview> findByCandidateId(Long candidateId, Pageable pageable);

    @Query(
            "SELECT i FROM Interview i WHERE i.companyId = :companyId"
                    + " AND (:status IS NULL OR i.status = :status)")
    Page<Interview> searchForCompany(
            @Param("companyId") Long companyId,
            @Param("status") InterviewStatus status,
            Pageable pageable);

    @Query(
            "SELECT i FROM Interview i WHERE i.status = :status AND i.reminder24hSent = false"
                    + " AND i.startsAt > :now AND i.startsAt <= :limit")
    List<Interview> findDueFor24hReminder(
            @Param("status") InterviewStatus status,
            @Param("now") Instant now,
            @Param("limit") Instant limit);

    @Query(
            "SELECT i FROM Interview i WHERE i.status = :status AND i.reminder1hSent = false"
                    + " AND i.startsAt > :now AND i.startsAt <= :limit")
    List<Interview> findDueFor1hReminder(
            @Param("status") InterviewStatus status,
            @Param("now") Instant now,
            @Param("limit") Instant limit);
}
