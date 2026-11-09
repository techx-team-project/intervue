package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.SavedJob;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    Page<SavedJob> findByCandidateId(Long candidateId, Pageable pageable);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    long countByCandidateId(Long candidateId);

    void deleteByCandidateIdAndJobId(Long candidateId, Long jobId);

    @Query("SELECT s.jobId FROM SavedJob s WHERE s.candidateId = :candidateId")
    List<Long> findJobIdsByCandidateId(@Param("candidateId") Long candidateId);
}
