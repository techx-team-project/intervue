package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.Interview;
import com.techx.intervue.modules.application.enums.InterviewEventType;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.events.InterviewEvent;
import com.techx.intervue.modules.application.mappers.InterviewMapper;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.InterviewRepository;
import com.techx.intervue.modules.application.resources.InterviewResource;
import com.techx.intervue.modules.application.services.interfaces.CandidateInterviewServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateInterviewService implements CandidateInterviewServiceInterface {

    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "startsAt").and(Sort.by(Sort.Direction.DESC, "id"));

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewStatusPolicy interviewPolicy;
    private final InterviewMapper mapper;
    private final InterviewIcsBuilder icsBuilder;
    private final ApplicationEventPublisher events;

    @Override
    @Transactional(readOnly = true)
    public Page<InterviewResource> list(Pageable pageable, Long candidateId) {
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        Page<Interview> page = interviewRepository.findByCandidateId(candidateId, newestFirst);
        return new PageImpl<>(
                mapper.toResources(page.getContent()), newestFirst, page.getTotalElements());
    }

    @Override
    @Transactional
    public InterviewResource confirm(Long interviewId, Long candidateId) {
        Interview interview = requireUpcoming(interviewId, candidateId);
        if (interview.getStatus() != InterviewStatus.PROPOSED) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        interview.setStatus(InterviewStatus.CONFIRMED);
        events.publishEvent(new InterviewEvent(interview.getId(), InterviewEventType.CONFIRMED));
        return mapper.toResource(interview);
    }

    @Override
    @Transactional
    public InterviewResource decline(Long interviewId, String reason, Long candidateId) {
        Interview interview = requireUpcoming(interviewId, candidateId);
        interviewPolicy.requireTransition(interview.getStatus(), InterviewStatus.DECLINED);
        interview.setStatus(InterviewStatus.DECLINED);
        interview.setCandidateMessage(blankToNull(reason));
        events.publishEvent(new InterviewEvent(interview.getId(), InterviewEventType.DECLINED));
        return mapper.toResource(interview);
    }

    @Override
    @Transactional
    public InterviewResource requestReschedule(
            Long interviewId, Instant proposedStartsAt, String message, Long candidateId) {
        Interview interview = requireUpcoming(interviewId, candidateId);
        if (interview.getStatus() == InterviewStatus.RESCHEDULE_REQUESTED) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        interviewPolicy.requireTransition(
                interview.getStatus(), InterviewStatus.RESCHEDULE_REQUESTED);
        interview.setStatus(InterviewStatus.RESCHEDULE_REQUESTED);
        interview.setProposedStartsAt(proposedStartsAt);
        interview.setCandidateMessage(blankToNull(message));
        events.publishEvent(
                new InterviewEvent(interview.getId(), InterviewEventType.RESCHEDULE_REQUESTED));
        return mapper.toResource(interview);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] calendarFile(Long interviewId, Long candidateId) {
        Interview interview = require(interviewId, candidateId);
        if (interview.getStatus() == InterviewStatus.CANCELLED
                || interview.getStatus() == InterviewStatus.DECLINED) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        Application application =
                applicationRepository
                        .findById(interview.getApplicationId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return icsBuilder.build(interview, application);
    }

    private Interview requireUpcoming(Long interviewId, Long candidateId) {
        Interview interview = require(interviewId, candidateId);
        if (!interview.getStartsAt().isAfter(Instant.now())) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        return interview;
    }

    private Interview require(Long interviewId, Long candidateId) {
        return interviewRepository
                .findByIdAndCandidateId(interviewId, candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
