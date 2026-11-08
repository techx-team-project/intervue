package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CompanyFollow;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyFollowRepository extends JpaRepository<CompanyFollow, Long> {

    Page<CompanyFollow> findByCandidateId(Long candidateId, Pageable pageable);

    boolean existsByCandidateIdAndCompanyId(Long candidateId, Long companyId);

    long countByCandidateId(Long candidateId);

    void deleteByCandidateIdAndCompanyId(Long candidateId, Long companyId);

    @Query("SELECT f.companyId FROM CompanyFollow f WHERE f.candidateId = :candidateId")
    List<Long> findCompanyIdsByCandidateId(@Param("candidateId") Long candidateId);

    @Query(
            "SELECT f.candidateId FROM CompanyFollow f WHERE f.companyId = :companyId"
                    + " ORDER BY f.id")
    Page<Long> findCandidateIdsByCompanyId(@Param("companyId") Long companyId, Pageable pageable);
}
