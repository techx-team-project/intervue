package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateEducation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateEducationRepository extends JpaRepository<CandidateEducation, Long> {

    List<CandidateEducation> findByCandidateProfileIdOrderByStartYearDesc(Long candidateProfileId);

    Optional<CandidateEducation> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
