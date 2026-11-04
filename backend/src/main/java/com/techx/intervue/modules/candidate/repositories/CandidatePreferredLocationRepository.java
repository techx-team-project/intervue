package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidatePreferredLocation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidatePreferredLocationRepository
        extends JpaRepository<CandidatePreferredLocation, Long> {

    List<CandidatePreferredLocation> findByCandidateProfileIdOrderByCityAsc(
            Long candidateProfileId);

    void deleteByCandidateProfileId(Long candidateProfileId);
}
