package com.techx.intervue.modules.candidate.credits.repositories;

import com.techx.intervue.modules.candidate.credits.entities.CandidateCreditTransaction;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateCreditTransactionRepository
        extends JpaRepository<CandidateCreditTransaction, Long> {

    List<CandidateCreditTransaction> findByCandidateIdOrderByCreatedAtDesc(
            Long candidateId, Pageable pageable);

    List<CandidateCreditTransaction> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);
}
