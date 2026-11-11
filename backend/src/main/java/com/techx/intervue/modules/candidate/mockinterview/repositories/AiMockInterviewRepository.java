package com.techx.intervue.modules.candidate.mockinterview.repositories;

import com.techx.intervue.modules.candidate.mockinterview.entities.AiMockInterview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiMockInterviewRepository extends JpaRepository<AiMockInterview, Long> {

    Page<AiMockInterview> findAllByCandidateIdOrderByCreatedAtDesc(
            Long candidateId, Pageable pageable);

    List<AiMockInterview> findAllByCandidateIdOrderByCreatedAtDesc(Long candidateId);

    Optional<AiMockInterview> findByIdAndCandidateId(Long id, Long candidateId);
}
