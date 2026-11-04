package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateSkill;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, Long> {

    List<CandidateSkill> findByCandidateProfileIdOrderByNameAsc(Long candidateProfileId);

    Optional<CandidateSkill> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
