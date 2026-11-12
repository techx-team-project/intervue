package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.events.JobClosedEvent;
import com.techx.intervue.modules.job.events.JobPublishedEvent;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.repositories.JobRepository.StatusCount;
import com.techx.intervue.modules.job.repositories.JobSpecifications;
import com.techx.intervue.modules.job.repositories.SkillRepository;
import com.techx.intervue.modules.job.requests.SaveJobRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import com.techx.intervue.modules.job.resources.JobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.JobApplicationLookupInterface;
import com.techx.intervue.modules.job.services.interfaces.JobServiceInterface;
import java.time.Instant;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobService implements JobServiceInterface {

    private static final Set<JobStatus> EDITABLE =
            Set.of(JobStatus.DRAFT, JobStatus.PUBLISHED, JobStatus.PAUSED);
    private static final Set<JobStatus> CLOSABLE = Set.of(JobStatus.PUBLISHED, JobStatus.PAUSED);

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final JobMapper jobMapper;
    private final JobStatusPolicy statusPolicy;
    private final JobPublishRules publishRules;
    private final JobContentScreener contentScreener;
    private final ScreeningQuestionRules screeningRules;
    private final JobApplicationLookupInterface applicationLookup;
    private final ApplicationEventPublisher eventPublisher;
    private final CompanyServiceInterface companyService;
    private final CompanyVerificationServiceInterface companyVerificationService;
    private final EntitlementServiceInterface entitlementService;
    private final FreeQuotaPolicyInterface freeQuotaPolicy;

    @Override
    @Transactional
    public JobResource create(SaveJobRequest request, Long recruiterId) {
        CompanyResource company = requireCompany(recruiterId);
        Job job =
                Job.builder()
                        .recruiterId(recruiterId)
                        .companyId(company.id())
                        .companyName(company.name())
                        .build();
        jobMapper.apply(job, request, resolveSkills(request.skillIds()));
        applyScreeningQuestions(job, request);
        return jobMapper.toResource(jobRepository.save(job));
    }

    @Override
    @Transactional
    public JobResource update(Long jobId, SaveJobRequest request, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        if (!EDITABLE.contains(job.getStatus())) {
            throw new AppException(ErrorCode.JOB_NOT_EDITABLE);
        }
        jobMapper.apply(job, request, resolveSkills(request.skillIds()));
        applyScreeningQuestions(job, request);
        if (job.getStatus() != JobStatus.DRAFT) {
            publishRules.assertComplete(job);
            contentScreener.assertAllowed(job);
            entitlementService
                    .jobSlotExpiresAt(job.getId())
                    .ifPresent(endsAt -> assertDeadlineWithinSlot(job.getDeadline(), endsAt));
            contentScreener.flagForReview(job);
        }
        return jobMapper.toResource(job);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResource findOne(Long jobId, Long recruiterId) {
        return jobMapper.toResource(requireOwned(jobId, recruiterId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobSummaryResource> search(
            SearchRecruiterJobsRequest request, Pageable pageable, Long recruiterId) {
        return jobRepository
                .findAll(JobSpecifications.ownedBy(recruiterId, request), pageable)
                .map(jobMapper::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public JobStatusCountsResource countByStatus(Long recruiterId) {
        Map<JobStatus, Long> counts = new EnumMap<>(JobStatus.class);
        for (JobStatus status : JobStatus.values()) {
            counts.put(status, 0L);
        }
        long total = 0;
        for (StatusCount row : jobRepository.countByStatusForRecruiter(recruiterId)) {
            counts.put(row.getStatus(), row.getTotal());
            total += row.getTotal();
        }
        return new JobStatusCountsResource(total, counts);
    }

    @Override
    @Transactional
    public JobResource publish(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, Set.of(JobStatus.DRAFT));
        assertReadyToGoLive(job, recruiterId);
        consumeJobSlot(job, recruiterId);
        JobResource published = markLive(job);
        contentScreener.flagForReview(job);
        eventPublisher.publishEvent(
                new JobPublishedEvent(
                        job.getId(),
                        job.getCompanyId(),
                        job.getTitle(),
                        companyService.findSummary(job.getCompanyId()).name()));
        return published;
    }

    @Override
    @Transactional
    public JobResource resume(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, Set.of(JobStatus.PAUSED));
        assertReadyToGoLive(job, recruiterId);
        entitlementService
                .jobSlotExpiresAt(job.getId())
                .ifPresent(
                        endsAt -> {
                            if (endsAt.isBefore(Instant.now())) {
                                throw new AppException(ErrorCode.ENTITLEMENT_EXPIRED);
                            }
                            assertDeadlineWithinSlot(job.getDeadline(), endsAt);
                        });
        return markLive(job);
    }

    @Override
    @Transactional
    public JobResource retop(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        if (job.getStatus() != JobStatus.PUBLISHED
                || (job.getDeadline() != null
                        && job.getDeadline().isBefore(JobDeadlines.today()))) {
            throw new AppException(ErrorCode.JOB_MUST_BE_PUBLISHED);
        }
        if (!entitlementService.consumeRetop(job.getCompanyId(), job.getId(), recruiterId)) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }
        job.setRetoppedAt(Instant.now());
        return jobMapper.toResource(job);
    }

    @Override
    @Transactional
    public JobResource pause(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, Set.of(JobStatus.PUBLISHED));
        statusPolicy.requireTransition(job.getStatus(), JobStatus.PAUSED);
        job.setStatus(JobStatus.PAUSED);
        return jobMapper.toResource(job);
    }

    @Override
    @Transactional
    public JobResource close(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, CLOSABLE);
        statusPolicy.requireTransition(job.getStatus(), JobStatus.CLOSED);
        job.setStatus(JobStatus.CLOSED);
        eventPublisher.publishEvent(new JobClosedEvent(job.getId()));
        return jobMapper.toResource(job);
    }

    @Override
    @Transactional
    public void delete(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        if (job.getStatus() != JobStatus.DRAFT) {
            throw new AppException(ErrorCode.JOB_NOT_EDITABLE);
        }
        jobRepository.delete(job);
    }

    private void applyScreeningQuestions(Job job, SaveJobRequest request) {
        if (request.screeningQuestions() == null) {
            return;
        }
        List<SaveJobRequest.ScreeningQuestion> questions =
                screeningRules.normalise(request.screeningQuestions());
        if (jobMapper.hasSameScreeningQuestions(job, questions)) {
            return;
        }
        if (job.getId() != null && applicationLookup.hasApplications(job.getId())) {
            throw new AppException(ErrorCode.SCREENING_QUESTIONS_LOCKED);
        }
        jobMapper.replaceScreeningQuestions(job, questions);
    }

    // A slot is spent only on the first publish; resuming a paused job must not cost another one.
    private void consumeJobSlot(Job job, Long recruiterId) {
        Optional<Integer> durationDays =
                entitlementService.consumeJobSlot(job.getCompanyId(), job.getId(), recruiterId);
        if (durationDays.isEmpty()) {
            if (freeQuotaPolicy.current().requireJobSlot()) {
                throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
            }
            return;
        }
        // Rejecting rolls the whole publish back, which returns the slot we just took
        LocalDate latestAllowed = JobDeadlines.today().plusDays(durationDays.get());
        if (job.getDeadline() != null && job.getDeadline().isAfter(latestAllowed)) {
            throw AppException.validation(
                    "deadline", "The package you bought runs until " + latestAllowed);
        }
    }

    private void assertReadyToGoLive(Job job, Long recruiterId) {
        companyVerificationService.assertCanPublish(recruiterId);
        publishRules.assertComplete(job);
        contentScreener.assertAllowed(job);
        statusPolicy.requireTransition(job.getStatus(), JobStatus.PUBLISHED);
    }

    private JobResource markLive(Job job) {
        job.setStatus(JobStatus.PUBLISHED);
        if (job.getPublishedAt() == null) {
            job.setPublishedAt(Instant.now());
        }
        return jobMapper.toResource(job);
    }

    private void assertDeadlineWithinSlot(LocalDate deadline, Instant slotEndsAt) {
        if (deadline != null && slotEndsAt != null) {
            LocalDate latestAllowed = JobDeadlines.toBusinessDate(slotEndsAt);
            if (deadline.isAfter(latestAllowed)) {
                throw AppException.validation(
                        "deadline", "The package you bought runs until " + latestAllowed);
            }
        }
    }

    private void requireStatus(Job job, Set<JobStatus> allowed) {
        if (!allowed.contains(job.getStatus())) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
    }

    private Job requireOwned(Long jobId, Long recruiterId) {
        return jobRepository
                .findByIdAndRecruiterId(jobId, recruiterId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private CompanyResource requireCompany(Long recruiterId) {
        try {
            return companyService.findMyCompany(recruiterId);
        } catch (AppException e) {
            if (e.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw e;
        }
    }

    private Set<Skill> resolveSkills(List<Long> skillIds) {
        if (skillIds == null || skillIds.isEmpty()) {
            return Set.of();
        }
        Set<Long> distinct = new HashSet<>(skillIds);
        List<Skill> found = skillRepository.findAllByIdInAndActiveTrue(distinct);
        if (found.size() != distinct.size()) {
            throw AppException.validation("skillIds", "One or more skills are unknown or inactive");
        }
        return new HashSet<>(found);
    }
}
