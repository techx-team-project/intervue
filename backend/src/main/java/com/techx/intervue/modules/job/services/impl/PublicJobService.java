package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.repositories.JobSpecifications;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
public class PublicJobService implements PublicJobServiceInterface {

    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "publishedAt").and(Sort.by(Sort.Direction.DESC, "id"));

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final CompanyServiceInterface companyService;

    @Override
    @Transactional(readOnly = true)
    public Page<PublicJobSummaryResource> search(SearchJobsRequest request, Pageable pageable) {
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        Page<Job> page =
                jobRepository.findAll(
                        JobSpecifications.publicListing(request, JobDeadlines.today()),
                        newestFirst);
        Map<Long, String> logos = logosOf(page.getContent());
        return page.map(job -> jobMapper.toPublicSummary(job, logos.get(job.getRecruiterId())));
    }

    @Override
    @Transactional(readOnly = true)
    public PublicJobResource findOne(Long jobId) {
        Job job =
                jobRepository
                        .findByIdAndStatus(jobId, JobStatus.PUBLISHED)
                        .filter(found -> !found.getDeadline().isBefore(JobDeadlines.today()))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        String logo = logosOf(List.of(job)).get(job.getRecruiterId());
        String address = companyService.findSummary(job.getCompanyId()).address();
        return jobMapper.toPublicResource(job, logo, address);
    }

    private Map<Long, String> logosOf(List<Job> jobs) {
        Set<Long> recruiterIds = jobs.stream().map(Job::getRecruiterId).collect(Collectors.toSet());
        return companyService.findLogoUrlsByRecruiterIds(recruiterIds);
    }
}
