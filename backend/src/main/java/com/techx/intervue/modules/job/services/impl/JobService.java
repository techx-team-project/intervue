package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.common.policy.FreeQuotaValues;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.JobFreePost;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.events.JobClosedEvent;
import com.techx.intervue.modules.job.events.JobPublishedEvent;
import com.techx.intervue.modules.job.events.JobSubmittedForReviewEvent;
import com.techx.intervue.modules.job.events.JobTermsChangedEvent;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobFreePostRepository;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.repositories.JobRepository.StatusCount;
import com.techx.intervue.modules.job.repositories.JobSpecifications;
import com.techx.intervue.modules.job.repositories.SkillRepository;
import com.techx.intervue.modules.job.requests.RenewJobRequest;
import com.techx.intervue.modules.job.requests.SaveJobRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import com.techx.intervue.modules.job.requests.SimilarJobsRequest;
import com.techx.intervue.modules.job.resources.JobQuotaResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import com.techx.intervue.modules.job.resources.JobSummaryResource;
import com.techx.intervue.modules.job.resources.SimilarJobResource;
import com.techx.intervue.modules.job.services.interfaces.JobApplicationLookupInterface;
import com.techx.intervue.modules.job.services.interfaces.JobServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
    private static final Set<JobStatus> RENEWABLE = Set.of(JobStatus.CLOSED, JobStatus.EXPIRED);
    private static final Duration FREE_REOPEN_WINDOW = Duration.ofDays(7);
    private static final Map<String, String> APPLICANT_FACING_FIELDS =
            Map.of(
                    "title", "job title",
                    "salary", "salary",
                    "location", "location",
                    "contractType", "contract type",
                    "workingArrangement", "working arrangement");

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final JobMapper jobMapper;
    private final JobStatusPolicy statusPolicy;
    private final JobPublishRules publishRules;
    private final JobContentScreener contentScreener;
    private final JobActivityRecorder activityRecorder;
    private final ScreeningQuestionRules screeningRules;
    private final JobApplicationLookupInterface applicationLookup;
    private final ApplicationEventPublisher eventPublisher;
    private final CompanyServiceInterface companyService;
    private final CompanyVerificationServiceInterface companyVerificationService;
    private final EntitlementServiceInterface entitlementService;
    private final FreeQuotaPolicyInterface freeQuotaPolicy;
    private final JobFreePostRepository freePostRepository;

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
        Job saved = jobRepository.save(job);
        activityRecorder.record(recruiterId, AuditAction.JOB_CREATED, saved, saved.getTitle());
        return jobMapper.toResource(saved);
    }

    @Override
    @Transactional
    public JobResource update(Long jobId, SaveJobRequest request, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        if (!EDITABLE.contains(job.getStatus())) {
            throw new AppException(ErrorCode.JOB_NOT_EDITABLE);
        }
        JobResource before = jobMapper.toResource(job);
        LocalDate previousDeadline = job.getDeadline();
        jobMapper.apply(job, request, resolveSkills(request.skillIds()));
        applyScreeningQuestions(job, request);
        if (job.getStatus() != JobStatus.DRAFT) {
            publishRules.assertComplete(job);
            contentScreener.assertAllowed(job);
            entitlementService
                    .jobSlotExpiresAt(job.getId())
                    .ifPresentOrElse(
                            endsAt -> assertDeadlineWithinSlot(job.getDeadline(), endsAt),
                            () -> assertFreeDeadlineUnchangedOrAllowed(job, previousDeadline));
            contentScreener.flagForReview(job);
        }
        JobResource after = jobMapper.toResource(job);
        List<String> changedFields = activityRecorder.changedFieldNames(before, after);
        if (job.getStatus() != JobStatus.DRAFT && !changedFields.isEmpty()) {
            activityRecorder.record(
                    recruiterId, AuditAction.JOB_UPDATED, job, String.join(", ", changedFields));
            announceApplicantFacingChanges(job, changedFields);
        }
        return after;
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
        if (needsFirstPostReview(job)) {
            return submitForReview(job, recruiterId);
        }
        JobResource published = goLive(job, recruiterId);
        activityRecorder.record(recruiterId, AuditAction.JOB_PUBLISHED, job, null);
        return published;
    }

    @Override
    @Transactional
    public JobResource publishApproved(Long jobId) {
        Job job =
                jobRepository
                        .findById(jobId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        requireStatus(job, Set.of(JobStatus.PENDING_REVIEW));
        assertReadyToGoLive(job, job.getRecruiterId());
        return goLive(job, job.getRecruiterId());
    }

    @Override
    @Transactional
    public JobResource resume(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, Set.of(JobStatus.PAUSED));
        Duration pausedFor = pausedDuration(job);
        if (job.getDeadline() != null) {
            job.setDeadline(job.getDeadline().plusDays(pausedFor.toDays()));
        }
        Optional<Instant> slotEndsAt = entitlementService.extendJobSlot(job.getId(), pausedFor);
        assertReadyToGoLive(job, recruiterId);
        slotEndsAt.ifPresent(
                endsAt -> {
                    if (endsAt.isBefore(Instant.now())) {
                        throw new AppException(ErrorCode.ENTITLEMENT_EXPIRED);
                    }
                    assertDeadlineWithinSlot(job.getDeadline(), endsAt);
                });
        JobResource resumed = markLive(job);
        activityRecorder.record(recruiterId, AuditAction.JOB_RESUMED, job, null);
        return resumed;
    }

    @Override
    @Transactional
    public JobResource renew(Long jobId, RenewJobRequest request, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, RENEWABLE);
        Optional<Instant> freeReopenSlotEnd = freeReopenSlotEnd(job);
        job.setDeadline(request.deadline());
        assertReadyToGoLive(job, recruiterId);
        freeReopenSlotEnd.ifPresentOrElse(
                endsAt -> assertDeadlineWithinSlot(request.deadline(), endsAt),
                () -> consumeJobSlot(job, recruiterId));
        job.setPublishedAt(null);
        JobResource renewed = markLive(job);
        contentScreener.flagForReview(job);
        activityRecorder.record(
                recruiterId, AuditAction.JOB_RENEWED, job, "deadline " + request.deadline());
        eventPublisher.publishEvent(
                new JobPublishedEvent(
                        job.getId(),
                        job.getCompanyId(),
                        job.getTitle(),
                        companyService.findSummary(job.getCompanyId()).name()));
        return renewed;
    }

    @Override
    @Transactional
    public JobResource extend(Long jobId, RenewJobRequest request, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, Set.of(JobStatus.PUBLISHED, JobStatus.PAUSED));
        LocalDate previousDeadline = job.getDeadline();
        if (previousDeadline != null && !request.deadline().isAfter(previousDeadline)) {
            throw AppException.validation("deadline", "Choose a date after the current deadline");
        }
        job.setDeadline(request.deadline());
        entitlementService
                .jobSlotExpiresAt(job.getId())
                .ifPresentOrElse(
                        endsAt -> assertDeadlineWithinSlot(request.deadline(), endsAt),
                        () -> assertFreeDeadlineUnchangedOrAllowed(job, previousDeadline));
        activityRecorder.record(
                recruiterId, AuditAction.JOB_UPDATED, job, "deadline " + request.deadline());
        return jobMapper.toResource(job);
    }

    @Override
    @Transactional(readOnly = true)
    public JobQuotaResource quota(Long recruiterId) {
        CompanyResource company = requireCompany(recruiterId);
        FreeQuotaValues free = freeQuotaPolicy.current();
        return new JobQuotaResource(
                entitlementService.remainingOf(company.id(), EntitlementType.JOB_POST_SLOT),
                free.requireJobSlot(),
                free.jobFreePostLimit(),
                free.jobFreeMaxDays(),
                freePostRepository.countByCompanyId(company.id()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SimilarJobResource> findSimilar(SimilarJobsRequest request, Long recruiterId) {
        CompanyResource company = requireCompany(recruiterId);
        if (request.city() == null || request.city().isBlank()) {
            return List.of();
        }
        return jobRepository
                .findTop5ByCompanyIdAndStatusAndTitleIgnoreCaseAndCityIgnoreCaseAndIdNot(
                        company.id(),
                        JobStatus.PUBLISHED,
                        request.title().trim(),
                        request.city().trim(),
                        request.excludeId() == null ? 0L : request.excludeId())
                .stream()
                .map(job -> new SimilarJobResource(job.getId(), job.getTitle(), job.getCity()))
                .toList();
    }

    @Override
    @Transactional
    public JobResource pause(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, Set.of(JobStatus.PUBLISHED));
        statusPolicy.requireTransition(job.getStatus(), JobStatus.PAUSED);
        job.setStatus(JobStatus.PAUSED);
        job.setPausedAt(Instant.now());
        activityRecorder.record(recruiterId, AuditAction.JOB_PAUSED, job, null);
        return jobMapper.toResource(job);
    }

    @Override
    @Transactional
    public JobResource close(Long jobId, Long recruiterId) {
        Job job = requireOwned(jobId, recruiterId);
        requireStatus(job, CLOSABLE);
        statusPolicy.requireTransition(job.getStatus(), JobStatus.CLOSED);
        job.setStatus(JobStatus.CLOSED);
        job.setPausedAt(null);
        job.setClosedAt(Instant.now());
        eventPublisher.publishEvent(new JobClosedEvent(job.getId()));
        activityRecorder.record(recruiterId, AuditAction.JOB_CLOSED, job, null);
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
            FreeQuotaValues quota = freeQuotaPolicy.current();
            if (quota.requireJobSlot()) {
                throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
            }
            assertFreePostAvailable(job.getCompanyId(), quota);
            assertDeadlineWithinFreeWindow(job.getDeadline(), JobDeadlines.today(), quota);
            freePostRepository.save(
                    JobFreePost.builder().companyId(job.getCompanyId()).jobId(job.getId()).build());
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
        job.setPausedAt(null);
        job.setClosedAt(null);
        if (job.getApprovedAt() == null) {
            job.setApprovedAt(Instant.now());
        }
        if (job.getPublishedAt() == null) {
            job.setPublishedAt(Instant.now());
        }
        return jobMapper.toResource(job);
    }

    private void announceApplicantFacingChanges(Job job, List<String> changedFields) {
        String changes =
                changedFields.stream()
                        .filter(APPLICANT_FACING_FIELDS::containsKey)
                        .map(APPLICANT_FACING_FIELDS::get)
                        .collect(Collectors.joining(", "));
        if (!changes.isEmpty()) {
            eventPublisher.publishEvent(new JobTermsChangedEvent(job.getId(), changes));
        }
    }

    private JobResource goLive(Job job, Long recruiterId) {
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

    private boolean needsFirstPostReview(Job job) {
        return jobRepository.countByCompanyIdAndApprovedAtIsNotNull(job.getCompanyId())
                < freeQuotaPolicy.current().jobReviewFirstCount();
    }

    // The slot is only spent when an admin approves, so this just checks it will be available.
    private JobResource submitForReview(Job job, Long recruiterId) {
        assertSlotAvailable(job);
        statusPolicy.requireTransition(job.getStatus(), JobStatus.PENDING_REVIEW);
        job.setStatus(JobStatus.PENDING_REVIEW);
        activityRecorder.record(recruiterId, AuditAction.JOB_SUBMITTED, job, null);
        eventPublisher.publishEvent(
                new JobSubmittedForReviewEvent(
                        job.getId(), companyService.findSummary(job.getCompanyId()).name()));
        return jobMapper.toResource(job);
    }

    private void assertSlotAvailable(Job job) {
        if (entitlementService.remainingOf(job.getCompanyId(), EntitlementType.JOB_POST_SLOT) > 0) {
            return;
        }
        FreeQuotaValues quota = freeQuotaPolicy.current();
        if (quota.requireJobSlot()) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }
        assertFreePostAvailable(job.getCompanyId(), quota);
        assertDeadlineWithinFreeWindow(job.getDeadline(), JobDeadlines.today(), quota);
    }

    private Duration pausedDuration(Job job) {
        return job.getPausedAt() == null
                ? Duration.ZERO
                : Duration.between(job.getPausedAt(), Instant.now());
    }

    // Only a job closed by its recruiter, still inside the paid window, comes back without a new
    // slot.
    private Optional<Instant> freeReopenSlotEnd(Job job) {
        Instant now = Instant.now();
        if (job.getStatus() != JobStatus.CLOSED
                || job.getClosedAt() == null
                || job.getClosedAt().isBefore(now.minus(FREE_REOPEN_WINDOW))) {
            return Optional.empty();
        }
        return entitlementService
                .jobSlotExpiresAt(job.getId())
                .filter(endsAt -> endsAt.isAfter(now));
    }

    private void assertFreePostAvailable(Long companyId, FreeQuotaValues quota) {
        if (freePostRepository.countByCompanyId(companyId) >= quota.jobFreePostLimit()) {
            throw new AppException(ErrorCode.ENTITLEMENT_EXHAUSTED);
        }
    }

    private void assertDeadlineWithinFreeWindow(
            LocalDate deadline, LocalDate from, FreeQuotaValues quota) {
        LocalDate latestAllowed = from.plusDays(quota.jobFreeMaxDays());
        if (deadline != null && deadline.isAfter(latestAllowed)) {
            throw AppException.validation(
                    "deadline",
                    "Free job posts can run until " + latestAllowed + ", buy a package for longer");
        }
    }

    private void assertFreeDeadlineUnchangedOrAllowed(Job job, LocalDate previousDeadline) {
        if (job.getDeadline() == null
                || job.getDeadline().equals(previousDeadline)
                || job.getPublishedAt() == null) {
            return;
        }
        assertDeadlineWithinFreeWindow(
                job.getDeadline(),
                JobDeadlines.toBusinessDate(job.getPublishedAt()),
                freeQuotaPolicy.current());
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
