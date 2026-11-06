package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.ApplicationAnswer;
import com.techx.intervue.modules.application.entities.ApplicationStatusHistory;
import com.techx.intervue.modules.application.enums.ApplicationActorType;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.mappers.ApplicationMapper;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.ApplicationSpecifications;
import com.techx.intervue.modules.application.requests.SaveApplicationRequest;
import com.techx.intervue.modules.application.requests.SearchApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationResource;
import com.techx.intervue.modules.application.resources.ApplicationSummaryResource;
import com.techx.intervue.modules.application.resources.ApplyFormResource;
import com.techx.intervue.modules.application.services.interfaces.ApplicationServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeSnapshot;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface.ApplyQuestion;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface.ApplyTarget;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.time.Instant;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@RequiredArgsConstructor
public class ApplicationService implements ApplicationServiceInterface {

    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "updatedAt").and(Sort.by(Sort.Direction.DESC, "id"));
    private static final String RECRUITER_APPLICATIONS_PATH = "/recruiter/applications";

    private final ApplicationRepository applicationRepository;
    private final JobLookupInterface jobLookup;
    private final ApplicationEligibility eligibility;
    private final ApplicationAnswerRules answerRules;
    private final ApplicationStatusPolicy statusPolicy;
    private final CvSnapshotService cvSnapshots;
    private final ApplicationMapper applicationMapper;
    private final NotificationPublisherInterface notificationPublisher;
    private final TransactionTemplate transaction;

    @Override
    @Transactional(readOnly = true)
    public ApplyFormResource findForm(Long jobId, Long candidateId) {
        ApplyTarget target = jobLookup.requireApplyTarget(jobId);
        ApplicationResource mine =
                applicationRepository
                        .findByJobIdAndCandidateId(jobId, candidateId)
                        .map(applicationMapper::toResource)
                        .orElse(null);
        return ApplyFormResource.builder()
                .jobId(target.jobId())
                .jobTitle(target.title())
                .companyName(target.companyName())
                .open(target.open())
                .questions(target.questions().stream().map(applicationMapper::toQuestion).toList())
                .application(mine)
                .build();
    }

    @Override
    public ApplicationResource saveDraft(SaveApplicationRequest request, RequestActor actor) {
        ApplyTarget target = jobLookup.requireApplyTarget(request.jobId());
        eligibility.requireCanApply(target, actor);
        Map<ApplyQuestion, String> given =
                answerRules.collect(target.questions(), request.answers());

        return guardingDuplicates(
                () ->
                        transaction.execute(
                                status -> {
                                    Application application =
                                            applicationRepository
                                                    .findByJobIdAndCandidateId(
                                                            target.jobId(), actor.userId())
                                                    .orElseGet(
                                                            () -> draftOf(target, actor.userId()));
                                    requireStatus(application, ApplicationStatus.DRAFT);
                                    application.setCoverLetter(blankToNull(request.coverLetter()));
                                    application.setDraftResumeId(request.resumeId());
                                    replaceAnswers(application, given);
                                    return applicationMapper.toResource(
                                            applicationRepository.saveAndFlush(application));
                                }));
    }

    // The CV copy is an external call, so it happens outside the transaction.
    @Override
    public ApplicationResource submit(SaveApplicationRequest request, RequestActor actor) {
        if (request.resumeId() == null) {
            throw AppException.validation("resumeId", "Choose a CV to apply with");
        }
        ApplyTarget target = jobLookup.requireApplyTarget(request.jobId());
        eligibility.requireCanApply(target, actor);
        Map<ApplyQuestion, String> given =
                answerRules.collect(target.questions(), request.answers());
        answerRules.requireComplete(target.questions(), given);
        requireNoSubmittedApplication(target.jobId(), actor.userId());

        ResumeSnapshot snapshot = cvSnapshots.copy(request.resumeId(), actor.userId());
        try {
            return guardingDuplicates(
                    () ->
                            transaction.execute(
                                    status -> {
                                        Application application =
                                                applicationRepository
                                                        .findByJobIdAndCandidateId(
                                                                target.jobId(), actor.userId())
                                                        .orElseGet(
                                                                () ->
                                                                        draftOf(
                                                                                target,
                                                                                actor.userId()));
                                        requireStatus(application, ApplicationStatus.DRAFT);
                                        application.setCoverLetter(
                                                blankToNull(request.coverLetter()));
                                        application.setDraftResumeId(request.resumeId());
                                        replaceAnswers(application, given);
                                        cvSnapshots.attach(application, snapshot);
                                        application.setSubmittedAt(Instant.now());
                                        changeStatus(
                                                application,
                                                ApplicationStatus.APPLIED,
                                                actor.userId());
                                        Application saved =
                                                applicationRepository.saveAndFlush(application);
                                        notifyRecruiter(
                                                target, NotificationType.APPLICATION_RECEIVED);
                                        return applicationMapper.toResource(saved);
                                    }));
        } catch (RuntimeException e) {
            cvSnapshots.discard(snapshot.storagePublicId());
            throw e;
        }
    }

    @Override
    public ApplicationResource withdraw(Long applicationId, RequestActor actor) {
        return transaction.execute(
                status -> {
                    Application application = requireOwned(applicationId, actor.userId());
                    changeStatus(application, ApplicationStatus.WITHDRAWN, actor.userId());
                    applicationRepository.flush();
                    notifyRecruiter(
                            jobLookup.requireApplyTarget(application.getJobId()),
                            NotificationType.APPLICATION_WITHDRAWN);
                    return applicationMapper.toResource(application);
                });
    }

    @Override
    public ApplicationResource reapply(Long applicationId, Long resumeId, RequestActor actor) {
        Application current =
                transaction.execute(status -> requireOwned(applicationId, actor.userId()));
        if (current.getStatus() != ApplicationStatus.WITHDRAWN) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        ApplyTarget target = jobLookup.requireApplyTarget(current.getJobId());
        eligibility.requireCanApply(target, actor);

        String previousCopy = current.getCvStoragePublicId();
        ResumeSnapshot snapshot = cvSnapshots.copy(resumeId, actor.userId());
        ApplicationResource result;
        try {
            result =
                    transaction.execute(
                            status -> {
                                Application application =
                                        requireOwned(applicationId, actor.userId());
                                cvSnapshots.attach(application, snapshot);
                                application.setDraftResumeId(resumeId);
                                application.setSubmittedAt(Instant.now());
                                application.setViewedAt(null);
                                changeStatus(
                                        application, ApplicationStatus.APPLIED, actor.userId());
                                applicationRepository.flush();
                                notifyRecruiter(target, NotificationType.APPLICATION_RECEIVED);
                                return applicationMapper.toResource(application);
                            });
        } catch (RuntimeException e) {
            cvSnapshots.discard(snapshot.storagePublicId());
            throw e;
        }
        cvSnapshots.discard(previousCopy);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationSummaryResource> search(
            SearchApplicationsRequest request, Pageable pageable, Long candidateId) {
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        return applicationRepository
                .findAll(ApplicationSpecifications.ownedBy(candidateId, request), newestFirst)
                .map(applicationMapper::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResource findOne(Long applicationId, Long candidateId) {
        return applicationMapper.toResource(requireOwned(applicationId, candidateId));
    }

    @Override
    public ResumeContent downloadCv(Long applicationId, Long candidateId) {
        Application application =
                transaction.execute(status -> requireOwned(applicationId, candidateId));
        if (application.getCvStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return cvSnapshots.read(application);
    }

    private ApplicationResource guardingDuplicates(Supplier<ApplicationResource> action) {
        try {
            return action.get();
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.ALREADY_APPLIED);
        }
    }

    private void requireNoSubmittedApplication(Long jobId, Long candidateId) {
        ApplicationStatus existing =
                transaction.execute(
                        status ->
                                applicationRepository
                                        .findByJobIdAndCandidateId(jobId, candidateId)
                                        .map(Application::getStatus)
                                        .orElse(ApplicationStatus.DRAFT));
        if (existing != ApplicationStatus.DRAFT) {
            throw new AppException(ErrorCode.ALREADY_APPLIED);
        }
    }

    private void requireStatus(Application application, ApplicationStatus expected) {
        if (application.getStatus() != expected) {
            throw new AppException(ErrorCode.ALREADY_APPLIED);
        }
    }

    private Application draftOf(ApplyTarget target, Long candidateId) {
        return Application.builder()
                .jobId(target.jobId())
                .candidateId(candidateId)
                .companyId(target.companyId())
                .jobTitle(target.title())
                .companyName(target.companyName())
                .status(ApplicationStatus.DRAFT)
                .build();
    }

    private void changeStatus(Application application, ApplicationStatus next, Long candidateId) {
        ApplicationStatus previous = application.getStatus();
        statusPolicy.requireTransition(previous, next);
        application.setStatus(next);
        application
                .getHistory()
                .add(
                        ApplicationStatusHistory.builder()
                                .application(application)
                                .fromStatus(previous)
                                .toStatus(next)
                                .actorType(ApplicationActorType.CANDIDATE)
                                .actorId(candidateId)
                                .build());
    }

    // Updated in place: replacing rows would insert before deleting and break the unique key.
    private void replaceAnswers(Application application, Map<ApplyQuestion, String> given) {
        Map<Long, ApplicationAnswer> existing = new HashMap<>();
        application.getAnswers().forEach(answer -> existing.put(answer.getQuestionId(), answer));

        Iterator<ApplicationAnswer> iterator = application.getAnswers().iterator();
        while (iterator.hasNext()) {
            ApplicationAnswer answer = iterator.next();
            boolean kept =
                    given.keySet().stream().anyMatch(q -> q.id().equals(answer.getQuestionId()));
            if (!kept) {
                iterator.remove();
            }
        }
        given.forEach(
                (question, text) -> {
                    ApplicationAnswer answer = existing.get(question.id());
                    if (answer == null) {
                        application
                                .getAnswers()
                                .add(
                                        ApplicationAnswer.builder()
                                                .application(application)
                                                .questionId(question.id())
                                                .questionPrompt(question.prompt())
                                                .answerText(text)
                                                .build());
                    } else {
                        answer.setQuestionPrompt(question.prompt());
                        answer.setAnswerText(text);
                    }
                });
    }

    private void notifyRecruiter(ApplyTarget target, NotificationType type) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(target.recruiterId())
                        .type(type)
                        .params(Map.of("jobTitle", target.title()))
                        .actionUrl(RECRUITER_APPLICATIONS_PATH)
                        .build());
    }

    private Application requireOwned(Long applicationId, Long candidateId) {
        return applicationRepository
                .findByIdAndCandidateId(applicationId, candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
