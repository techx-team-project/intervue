package com.techx.intervue.modules.application.repositories;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository
        extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {

    Optional<Application> findByIdAndCandidateId(Long id, Long candidateId);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    Optional<Application> findByIdAndCompanyIdAndStatusNot(
            Long id, Long companyId, ApplicationStatus status);

    List<Application> findByJobIdAndStatusIn(Long jobId, Collection<ApplicationStatus> statuses);

    @Query(
            "SELECT a.status AS status, COUNT(a) AS total FROM Application a"
                    + " WHERE a.companyId = :companyId AND a.status <> :excluded"
                    + " AND (:jobId IS NULL OR a.jobId = :jobId) GROUP BY a.status")
    List<StatusCount> countByStatusForCompany(
            @Param("companyId") Long companyId,
            @Param("jobId") Long jobId,
            @Param("excluded") ApplicationStatus excluded);

    interface StatusCount {
        ApplicationStatus getStatus();

        long getTotal();
    }

    boolean existsByJobIdAndStatusNot(Long jobId, ApplicationStatus status);

    @Query(
            """
                SELECT DISTINCT a.candidateId AS candidateId, a.candidateName AS candidateName,
                                 a.candidateEmail AS candidateEmail
                FROM Application a
                WHERE a.companyId = :companyId AND a.candidateId = :candidateId
            """)
    Optional<CandidateApplicantProjection> findDistinctCandidateInCompany(
            @Param("candidateId") Long candidateId, @Param("companyId") Long companyId);

    @Query(
            """
                SELECT DISTINCT a.candidateId AS candidateId, a.candidateName AS candidateName,
                                 a.candidateEmail AS candidateEmail
                FROM Application a
                WHERE a.companyId = :companyId
                  AND a.candidateId NOT IN :excludeIds
                  AND (:search IS NULL
                       OR LOWER(a.candidateName) LIKE :search
                       OR LOWER(a.candidateEmail) LIKE :search)
            """)
    Page<CandidateApplicantProjection> searchDistinctCandidatesInCompany(
            @Param("companyId") Long companyId,
            @Param("excludeIds") Collection<Long> excludeIds,
            @Param("search") String search,
            Pageable pageable);

    interface CandidateApplicantProjection {
        Long getCandidateId();

        String getCandidateName();

        String getCandidateEmail();
    }
}
