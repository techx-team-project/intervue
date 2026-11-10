package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.ApplicationRepository.CandidateApplicantProjection;
import com.techx.intervue.modules.connect.services.interfaces.CandidateEligibilityPortInterface;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ConnectEligibilityAdapter implements CandidateEligibilityPortInterface {

    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<EligibleCandidate> findCandidateSummary(Long candidateId, Long companyId) {
        return applicationRepository
                .findDistinctCandidateInCompany(candidateId, companyId)
                .map(ConnectEligibilityAdapter::toEligibleCandidate);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EligibleCandidate> search(
            Long companyId,
            String search,
            Collection<Long> excludeCandidateIds,
            Pageable pageable) {
        Collection<Long> excludeIds =
                excludeCandidateIds.isEmpty() ? List.of(-1L) : excludeCandidateIds;
        String pattern =
                search == null || search.isBlank()
                        ? null
                        : SpecificationSupport.containsPattern(search);
        return applicationRepository
                .searchDistinctCandidatesInCompany(companyId, excludeIds, pattern, pageable)
                .map(ConnectEligibilityAdapter::toEligibleCandidate);
    }

    private static EligibleCandidate toEligibleCandidate(CandidateApplicantProjection projection) {
        return new EligibleCandidate(
                projection.getCandidateId(),
                projection.getCandidateName(),
                projection.getCandidateEmail());
    }
}
