package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CompanyFollow;
import com.techx.intervue.modules.candidate.repositories.CompanyFollowRepository;
import com.techx.intervue.modules.candidate.resources.FollowedCompanyResource;
import com.techx.intervue.modules.candidate.services.interfaces.CompanyFollowServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyFollowService implements CompanyFollowServiceInterface {

    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id"));

    private final CompanyFollowRepository followRepository;
    private final CompanyServiceInterface companyService;

    @Override
    @Transactional(readOnly = true)
    public Page<FollowedCompanyResource> list(Long candidateId, Pageable pageable) {
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        return followRepository
                .findByCandidateId(candidateId, newestFirst)
                .map(
                        follow ->
                                new FollowedCompanyResource(
                                        follow.getCompanyId(),
                                        follow.getCreatedAt(),
                                        companyService.findPublic(follow.getCompanyId())));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> listIds(Long candidateId) {
        return followRepository.findCompanyIdsByCandidateId(candidateId);
    }

    @Override
    @Transactional
    public void follow(Long candidateId, Long companyId) {
        if (followRepository.existsByCandidateIdAndCompanyId(candidateId, companyId)) {
            return;
        }
        companyService.findSummary(companyId);
        if (followRepository.countByCandidateId(candidateId) >= SavedJobService.MAX_SAVED) {
            throw new AppException(ErrorCode.SAVED_LIMIT_REACHED);
        }
        followRepository.save(
                CompanyFollow.builder().candidateId(candidateId).companyId(companyId).build());
    }

    @Override
    @Transactional
    public void unfollow(Long candidateId, Long companyId) {
        followRepository.deleteByCandidateIdAndCompanyId(candidateId, companyId);
    }
}
