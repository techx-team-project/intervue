package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.CandidateProject;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateProjectRepository extends JpaRepository<CandidateProject, Long> {

    List<CandidateProject> findByCandidateProfileIdOrderByCurrentDescStartDateDesc(
            Long candidateProfileId);

    Optional<CandidateProject> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    long countByCandidateProfileId(Long candidateProfileId);
}
