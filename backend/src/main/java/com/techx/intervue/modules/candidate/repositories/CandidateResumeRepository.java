package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateResume;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateResumeRepository extends JpaRepository<CandidateResume, Long> {

    List<CandidateResume> findByCandidateProfileIdOrderByCreatedAtDesc(Long candidateProfileId);

    Optional<CandidateResume> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    Optional<CandidateResume> findByCandidateProfileIdAndIsDefaultTrue(Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
