package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidatePreferredIndustry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidatePreferredIndustryRepository
        extends JpaRepository<CandidatePreferredIndustry, Long> {

    List<CandidatePreferredIndustry> findByCandidateProfileIdOrderByIndustryAsc(
            Long candidateProfileId);

    void deleteByCandidateProfileId(Long candidateProfileId);
}
