package com.techx.intervue.modules.ai.repositories;

import com.techx.intervue.modules.ai.entities.AiCvReview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiCvReviewRepository extends JpaRepository<AiCvReview, Long> {

    Optional<AiCvReview> findFirstByCandidateProfileIdAndFileHashOrderByCreatedAtDesc(
            Long candidateProfileId, String fileHash);

    List<AiCvReview> findByCandidateProfileIdOrderByCreatedAtDesc(Long candidateProfileId);
}
