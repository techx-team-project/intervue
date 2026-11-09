package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.SavedJob;
import com.techx.intervue.modules.candidate.repositories.SavedJobRepository;
import com.techx.intervue.modules.candidate.resources.SavedJobResource;
import com.techx.intervue.modules.candidate.services.interfaces.SavedJobServiceInterface;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavedJobService implements SavedJobServiceInterface {

    static final long MAX_SAVED = 200;
    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id"));

    private final SavedJobRepository savedJobRepository;
    private final PublicJobServiceInterface publicJobService;

    @Override
    @Transactional(readOnly = true)
    public Page<SavedJobResource> list(Long candidateId, Pageable pageable) {
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        Page<SavedJob> page = savedJobRepository.findByCandidateId(candidateId, newestFirst);
        Map<Long, PublicJobSummaryResource> jobs =
                publicJobService
                        .findSummaries(page.getContent().stream().map(SavedJob::getJobId).toList())
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        PublicJobSummaryResource::id, Function.identity()));
        return page.map(
                saved ->
                        new SavedJobResource(
                                saved.getJobId(),
                                saved.getCreatedAt(),
                                jobs.get(saved.getJobId())));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> listIds(Long candidateId) {
        return savedJobRepository.findJobIdsByCandidateId(candidateId);
    }

    @Override
    @Transactional
    public void save(Long candidateId, Long jobId) {
        if (savedJobRepository.existsByCandidateIdAndJobId(candidateId, jobId)) {
            return;
        }
        if (!publicJobService.isAvailable(jobId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        if (savedJobRepository.countByCandidateId(candidateId) >= MAX_SAVED) {
            throw new AppException(ErrorCode.SAVED_LIMIT_REACHED);
        }
        savedJobRepository.save(SavedJob.builder().candidateId(candidateId).jobId(jobId).build());
    }

    @Override
    @Transactional
    public void remove(Long candidateId, Long jobId) {
        savedJobRepository.deleteByCandidateIdAndJobId(candidateId, jobId);
    }
}
