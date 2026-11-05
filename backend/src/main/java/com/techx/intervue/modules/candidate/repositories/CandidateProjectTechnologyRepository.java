package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateProjectTechnology;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateProjectTechnologyRepository
        extends JpaRepository<CandidateProjectTechnology, Long> {

    List<CandidateProjectTechnology> findByCandidateProjectIdIn(
            Collection<Long> candidateProjectIds);

    void deleteByCandidateProjectId(Long candidateProjectId);
}
