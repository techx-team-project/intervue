package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.ApplicationNote;
import com.techx.intervue.modules.application.enums.ApplicationActorType;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.mappers.RecruiterApplicationMapper;
import com.techx.intervue.modules.application.repositories.ApplicationNoteRepository;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.ApplicationRepository.StatusCount;
import com.techx.intervue.modules.application.repositories.ApplicationSpecifications;
import com.techx.intervue.modules.application.requests.SearchRecruiterApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationStatusCountsResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationSummaryResource;
import com.techx.intervue.modules.application.services.interfaces.RecruiterApplicationServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import java.time.Instant;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterApplicationService implements RecruiterApplicationServiceInterface {

    static final Set<ApplicationStatus> RECRUITER_TARGETS =
            EnumSet.of(
                    ApplicationStatus.IN_REVIEW,
                    ApplicationStatus.INTERVIEW,
                    ApplicationStatus.OFFER,
                    ApplicationStatus.HIRED,
                    ApplicationStatus.REJECTED);
    private static final Set<ApplicationStatus> UNFINISHED =
            EnumSet.of(
                    ApplicationStatus.APPLIED,
                    ApplicationStatus.VIEWED,
                    ApplicationStatus.IN_REVIEW,
                    ApplicationStatus.INTERVIEW,
                    ApplicationStatus.OFFER);
    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "submittedAt").and(Sort.by(Sort.Direction.DESC, "id"));
    private static final String CLOSED_NOTE = "The job was closed";

    private final ApplicationRepository applicationRepository;
    private final ApplicationNoteRepository noteRepository;
    private final ApplicationStatusPolicy statusPolicy;
    private final ApplicationStatusChanger statusChanger;
    private final CvSnapshotService cvSnapshots;
    private final RecruiterApplicationMapper mapper;
    private final CompanyServiceInterface companyService;
    private final RecruiterServiceInterface recruiterService;
    private final NotificationPublisherInterface notificationPublisher;

    @Override
    @Transactional(readOnly = true)
    public Page<RecruiterApplicationSummaryResource> search(
            SearchRecruiterApplicationsRequest request, Pageable pageable, Long recruiterId) {
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        return applicationRepository
                .findAll(
                        ApplicationSpecifications.forCompany(companyOf(recruiterId), request),
                        newestFirst)
                .map(mapper::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationStatusCountsResource countByStatus(Long jobId, Long recruiterId) {
        Map<ApplicationStatus, Long> counts = new EnumMap<>(ApplicationStatus.class);
        for (ApplicationStatus status : ApplicationStatus.values()) {
            counts.put(status, 0L);
        }
        long total = 0;
        for (StatusCount row :
                applicationRepository.countByStatusForCompany(
                        companyOf(recruiterId), jobId, ApplicationStatus.DRAFT)) {
            counts.put(row.getStatus(), row.getTotal());
            total += row.getTotal();
        }
        counts.remove(ApplicationStatus.DRAFT);
        return new ApplicationStatusCountsResource(total, counts);
    }

    @Override
    @Transactional
    public RecruiterApplicationResource open(Long applicationId, Long recruiterId) {
        Application application = require(applicationId, recruiterId);
        if (application.getStatus() == ApplicationStatus.APPLIED) {
            application.setViewedAt(Instant.now());
            statusChanger.change(
                    application,
                    ApplicationStatus.VIEWED,
                    ApplicationActorType.RECRUITER,
                    recruiterId,
                    null);
            applicationRepository.flush();
        }
        return render(application);
    }

    @Override
    @Transactional
    public RecruiterApplicationResource changeStatus(
            Long applicationId, ApplicationStatus status, String note, Long recruiterId) {
        Application application = require(applicationId, recruiterId);
        if (!RECRUITER_TARGETS.contains(status)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        statusChanger.change(
                application,
                status,
                ApplicationActorType.RECRUITER,
                recruiterId,
                blankToNull(note));
        applicationRepository.flush();
        notifyCandidate(application);
        return render(application);
    }

    @Override
    @Transactional
    public RecruiterApplicationResource addNote(
            Long applicationId, String content, Long recruiterId) {
        Application application = require(applicationId, recruiterId);
        noteRepository.save(
                ApplicationNote.builder()
                        .applicationId(application.getId())
                        .authorId(recruiterId)
                        .authorName(recruiterService.getMe(recruiterId).name())
                        .content(content.trim())
                        .build());
        noteRepository.flush();
        return render(application);
    }

    @Override
    @Transactional
    public RecruiterApplicationResource deleteNote(
            Long applicationId, Long noteId, Long recruiterId) {
        Application application = require(applicationId, recruiterId);
        ApplicationNote note =
                noteRepository
                        .findByIdAndApplicationId(noteId, application.getId())
                        .filter(found -> found.getAuthorId().equals(recruiterId))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        noteRepository.delete(note);
        noteRepository.flush();
        return render(application);
    }

    @Override
    public ResumeContent downloadCv(Long applicationId, Long recruiterId) {
        Application application = require(applicationId, recruiterId);
        if (application.getCvStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return cvSnapshots.read(application);
    }

    @Override
    @Transactional
    public void closeForJob(Long jobId) {
        List<Application> unfinished =
                applicationRepository.findByJobIdAndStatusIn(jobId, UNFINISHED);
        unfinished.forEach(
                application ->
                        statusChanger.change(
                                application,
                                ApplicationStatus.JOB_CLOSED,
                                ApplicationActorType.SYSTEM,
                                null,
                                CLOSED_NOTE));
    }

    private Application require(Long applicationId, Long recruiterId) {
        return applicationRepository
                .findByIdAndCompanyIdAndStatusNot(
                        applicationId, companyOf(recruiterId), ApplicationStatus.DRAFT)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private Long companyOf(Long recruiterId) {
        try {
            return companyService.findMyCompany(recruiterId).id();
        } catch (AppException e) {
            if (e.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw e;
        }
    }

    private RecruiterApplicationResource render(Application application) {
        List<ApplicationStatus> next =
                RECRUITER_TARGETS.stream()
                        .filter(
                                target ->
                                        statusPolicy.canTransition(application.getStatus(), target))
                        .toList();
        return mapper.toResource(
                application,
                noteRepository.findByApplicationIdOrderByCreatedAtAsc(application.getId()),
                next);
    }

    private void notifyCandidate(Application application) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(application.getCandidateId())
                        .type(NotificationType.APPLICATION_STATUS_CHANGED)
                        .params(
                                Map.of(
                                        "jobTitle",
                                        application.getJobTitle(),
                                        "companyName",
                                        application.getCompanyName(),
                                        "status",
                                        statusLabel(application.getStatus())))
                        .actionUrl("/jobs/" + application.getJobId())
                        .build());
    }

    private String statusLabel(ApplicationStatus status) {
        return switch (status) {
            case IN_REVIEW -> "đang được xem xét";
            case INTERVIEW -> "được mời phỏng vấn";
            case OFFER -> "nhận được đề nghị";
            case HIRED -> "trúng tuyển";
            case REJECTED -> "chưa phù hợp";
            default -> status.name();
        };
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
