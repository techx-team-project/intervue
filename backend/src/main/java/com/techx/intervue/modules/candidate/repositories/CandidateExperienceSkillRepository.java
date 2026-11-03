package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateExperienceSkill;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateExperienceSkillRepository
        extends JpaRepository<CandidateExperienceSkill, Long> {

    List<CandidateExperienceSkill> findByCandidateExperienceIdIn(
            Collection<Long> candidateExperienceIds);

    void deleteByCandidateExperienceId(Long candidateExperienceId);
}
