package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateExperience;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateExperienceRepository extends JpaRepository<CandidateExperience, Long> {

    List<CandidateExperience> findByCandidateProfileIdOrderByCurrentDescStartDateDesc(
            Long candidateProfileId);

    Optional<CandidateExperience> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
