package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.geolocation.GeoDistance;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.repositories.JobSpecifications;
import com.techx.intervue.modules.job.requests.NearbyJobsRequest;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.NearbyJobResource;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PublicJobService implements PublicJobServiceInterface {

    private static final int NEARBY_CANDIDATE_LIMIT = 500;
    private static final int NEARBY_RESULT_LIMIT = 100;

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final CompanyServiceInterface companyService;

    @Override
    @Transactional(readOnly = true)
    public Page<PublicJobSummaryResource> search(SearchJobsRequest request, Pageable pageable) {
        Pageable unsorted = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<Job> page =
                jobRepository.findAll(
                        JobSpecifications.publicListing(
                                request, JobDeadlines.today(), Instant.now()),
                        unsorted);
        Map<Long, String> logos = logosOf(page.getContent());
        return page.map(job -> jobMapper.toPublicSummary(job, logos.get(job.getRecruiterId())));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NearbyJobResource> findNearby(NearbyJobsRequest request) {
        double radiusKm = request.effectiveRadiusKm();
        double latDelta = GeoDistance.latitudeDelta(radiusKm);
        double lngDelta = GeoDistance.longitudeDelta(radiusKm, request.lat());
        List<Job> candidates =
                jobRepository.findPublishedInBounds(
                        JobStatus.PUBLISHED,
                        JobDeadlines.today(),
                        BigDecimal.valueOf(request.lat() - latDelta),
                        BigDecimal.valueOf(request.lat() + latDelta),
                        BigDecimal.valueOf(request.lng() - lngDelta),
                        BigDecimal.valueOf(request.lng() + lngDelta),
                        Instant.now(),
                        PageRequest.of(0, NEARBY_CANDIDATE_LIMIT));
        Map<Long, String> logos = logosOf(candidates);
        return candidates.stream()
                .map(job -> toNearby(job, request, logos.get(job.getRecruiterId())))
                .filter(nearby -> nearby.distanceKm() <= radiusKm)
                .sorted(Comparator.comparingDouble(NearbyJobResource::distanceKm))
                .limit(NEARBY_RESULT_LIMIT)
                .toList();
    }

    private NearbyJobResource toNearby(Job job, NearbyJobsRequest request, String logoUrl) {
        double latitude = job.getLatitude().doubleValue();
        double longitude = job.getLongitude().doubleValue();
        double distanceKm =
                GeoDistance.haversineKm(request.lat(), request.lng(), latitude, longitude);
        return new NearbyJobResource(
                jobMapper.toPublicSummary(job, logoUrl),
                job.getAddress(),
                latitude,
                longitude,
                Math.round(distanceKm * 10) / 10.0);
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

    @Override
    @Transactional(readOnly = true)
    public Map<Long, Long> findCompanyIdsByJobIds(Collection<Long> jobIds) {
        if (jobIds.isEmpty()) {
            return Map.of();
        }
        return jobRepository.findAllById(jobIds).stream()
                .collect(Collectors.toMap(Job::getId, Job::getCompanyId, (first, second) -> first));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isAvailable(Long jobId) {
        return jobRepository.existsByIdAndStatusAndDeadlineGreaterThanEqual(
                jobId, JobStatus.PUBLISHED, JobDeadlines.today());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicJobSummaryResource> findSummaries(Collection<Long> jobIds) {
        if (jobIds.isEmpty()) {
            return List.of();
        }
        List<Job> jobs =
                jobRepository.findByIdInAndStatus(jobIds, JobStatus.PUBLISHED).stream()
                        .filter(job -> !job.getDeadline().isBefore(JobDeadlines.today()))
                        .toList();
        Map<Long, String> logos = logosOf(jobs);
        return jobs.stream()
                .map(job -> jobMapper.toPublicSummary(job, logos.get(job.getRecruiterId())))
                .toList();
    }

    private Map<Long, String> logosOf(List<Job> jobs) {
        Set<Long> recruiterIds = jobs.stream().map(Job::getRecruiterId).collect(Collectors.toSet());
        return companyService.findLogoUrlsByRecruiterIds(recruiterIds);
    }
}
