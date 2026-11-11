package com.techx.intervue.modules.connect.services.interfaces;

import java.time.Instant;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Implemented by the application module so connect can check eligibility without importing
 * application internals.
 */
public interface CandidateEligibilityPortInterface {

    record EligibleCandidate(
            Long candidateId,
            String fullName,
            String email,
            String jobTitle,
            Instant submittedAt) {}

    Optional<EligibleCandidate> findCandidateSummary(Long candidateId, Long companyId);

    Page<EligibleCandidate> search(
            Long companyId, String search, Collection<Long> excludeCandidateIds, Pageable pageable);
}
