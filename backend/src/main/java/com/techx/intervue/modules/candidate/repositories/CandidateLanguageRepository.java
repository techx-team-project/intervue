package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateLanguage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateLanguageRepository extends JpaRepository<CandidateLanguage, Long> {

    List<CandidateLanguage> findByCandidateProfileIdOrderByLanguageAsc(Long candidateProfileId);

    Optional<CandidateLanguage> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
