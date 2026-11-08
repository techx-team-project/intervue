package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.Interview;
import com.techx.intervue.modules.application.enums.ApplicationActorType;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.enums.InterviewEventType;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.events.InterviewEvent;
import com.techx.intervue.modules.application.mappers.InterviewMapper;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.InterviewRepository;
import com.techx.intervue.modules.application.requests.ScheduleInterviewRequest;
import com.techx.intervue.modules.application.resources.InterviewResource;
import com.techx.intervue.modules.application.services.interfaces.RecruiterInterviewServiceInterface;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterInterviewService implements RecruiterInterviewServiceInterface {

    private static final Set<ApplicationStatus> SCHEDULABLE =
            EnumSet.of(
                    ApplicationStatus.APPLIED,
                    ApplicationStatus.VIEWED,
                    ApplicationStatus.IN_REVIEW,
                    ApplicationStatus.INTERVIEW);
    private static final Sort SOONEST_FIRST =
            Sort.by(Sort.Direction.ASC, "startsAt").and(Sort.by(Sort.Direction.ASC, "id"));
    private static final String SCHEDULED_NOTE = "Interview scheduled";

    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewStatusPolicy interviewPolicy;
    private final ApplicationStatusChanger statusChanger;
    private final RecruiterCompanyScope companyScope;
    private final InterviewMapper mapper;
    private final ApplicationEventPublisher events;

    @Override
    @Transactional(readOnly = true)
    public Page<InterviewResource> search(
            InterviewStatus status, Pageable pageable, Long recruiterId) {
        Pageable soonestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), SOONEST_FIRST);
        Page<Interview> page =
                interviewRepository.searchForCompany(
                        companyScope.companyIdOf(recruiterId), status, soonestFirst);
        List<InterviewResource> items = mapper.toResources(page.getContent());
        return new org.springframework.data.domain.PageImpl<>(
                items, soonestFirst, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewResource> listForApplication(Long applicationId, Long recruiterId) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        return mapper.toResources(
                interviewRepository.findByApplicationIdAndCompanyIdOrderByCreatedAtDescIdDesc(
                        applicationId, companyId));
    }

    @Override
    @Transactional
    public InterviewResource schedule(
            Long applicationId, ScheduleInterviewRequest request, Long recruiterId) {
        Application application = requireApplication(applicationId, recruiterId);
        if (!SCHEDULABLE.contains(application.getStatus())) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        if (interviewRepository.existsByApplicationIdAndStatusIn(
                applicationId, InterviewStatus.ACTIVE)) {
            throw new AppException(ErrorCode.INTERVIEW_ALREADY_SCHEDULED);
        }
        moveToInterview(application, recruiterId);

        Interview interview =
                interviewRepository.save(
                        Interview.builder()
                                .applicationId(application.getId())
                                .candidateId(application.getCandidateId())
                                .companyId(application.getCompanyId())
                                .scheduledBy(recruiterId)
                                .startsAt(request.startsAt())
                                .durationMinutes(request.durationMinutes())
                                .format(request.format())
                                .location(request.location().trim())
                                .note(blankToNull(request.note()))
                                .status(InterviewStatus.PROPOSED)
                                .build());
        events.publishEvent(new InterviewEvent(interview.getId(), InterviewEventType.INVITED));
        return mapper.toResource(interview, application);
    }

    @Override
    @Transactional
    public InterviewResource update(
            Long interviewId, ScheduleInterviewRequest request, Long recruiterId) {
        Interview interview = requireInterview(interviewId, recruiterId);
        interviewPolicy.requireTransition(interview.getStatus(), InterviewStatus.PROPOSED);
        interview.setStartsAt(request.startsAt());
        interview.setDurationMinutes(request.durationMinutes());
        interview.setFormat(request.format());
        interview.setLocation(request.location().trim());
        interview.setNote(blankToNull(request.note()));
        restartInvitation(interview, InterviewStatus.PROPOSED);
        events.publishEvent(new InterviewEvent(interview.getId(), InterviewEventType.UPDATED));
        return mapper.toResource(interview);
    }

    @Override
    @Transactional
    public InterviewResource acceptProposal(Long interviewId, Long recruiterId) {
        Interview interview = requireInterview(interviewId, recruiterId);
        if (interview.getStatus() != InterviewStatus.RESCHEDULE_REQUESTED
                || interview.getProposedStartsAt() == null) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        interviewPolicy.requireTransition(interview.getStatus(), InterviewStatus.CONFIRMED);
        interview.setStartsAt(interview.getProposedStartsAt());
        restartInvitation(interview, InterviewStatus.CONFIRMED);
        events.publishEvent(new InterviewEvent(interview.getId(), InterviewEventType.UPDATED));
        return mapper.toResource(interview);
    }

    @Override
    @Transactional
    public InterviewResource cancel(Long interviewId, String reason, Long recruiterId) {
        Interview interview = requireInterview(interviewId, recruiterId);
        interviewPolicy.requireTransition(interview.getStatus(), InterviewStatus.CANCELLED);
        interview.setStatus(InterviewStatus.CANCELLED);
        interview.setCancelReason(blankToNull(reason));
        events.publishEvent(new InterviewEvent(interview.getId(), InterviewEventType.CANCELLED));
        return mapper.toResource(interview);
    }

    private void moveToInterview(Application application, Long recruiterId) {
        if (application.getStatus() == ApplicationStatus.INTERVIEW) {
            return;
        }
        if (application.getStatus() != ApplicationStatus.IN_REVIEW) {
            changeStatus(application, ApplicationStatus.IN_REVIEW, recruiterId);
        }
        changeStatus(application, ApplicationStatus.INTERVIEW, recruiterId);
    }

    private void changeStatus(Application application, ApplicationStatus next, Long recruiterId) {
        statusChanger.change(
                application, next, ApplicationActorType.RECRUITER, recruiterId, SCHEDULED_NOTE);
    }

    private void restartInvitation(Interview interview, InterviewStatus status) {
        interview.setStatus(status);
        interview.setProposedStartsAt(null);
        interview.setCandidateMessage(null);
        interview.setReminder24hSent(false);
        interview.setReminder1hSent(false);
    }

    private Application requireApplication(Long applicationId, Long recruiterId) {
        return applicationRepository
                .findByIdAndCompanyIdAndStatusNot(
                        applicationId,
                        companyScope.companyIdOf(recruiterId),
                        ApplicationStatus.DRAFT)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private Interview requireInterview(Long interviewId, Long recruiterId) {
        return interviewRepository
                .findByIdAndCompanyId(interviewId, companyScope.companyIdOf(recruiterId))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
