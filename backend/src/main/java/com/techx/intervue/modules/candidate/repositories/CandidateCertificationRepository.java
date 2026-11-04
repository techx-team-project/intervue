package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateCertification;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateCertificationRepository
        extends JpaRepository<CandidateCertification, Long> {

    List<CandidateCertification> findByCandidateProfileIdOrderByIssueDateDesc(
            Long candidateProfileId);

    Optional<CandidateCertification> findByIdAndCandidateProfileId(
            Long id, Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
