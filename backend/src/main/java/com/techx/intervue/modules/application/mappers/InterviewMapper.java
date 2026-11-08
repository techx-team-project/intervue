package com.techx.intervue.modules.application.mappers;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.Interview;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.resources.InterviewResource;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InterviewMapper {

    private final ApplicationRepository applicationRepository;

    public InterviewResource toResource(Interview interview) {
        Application application =
                applicationRepository
                        .findById(interview.getApplicationId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return toResource(interview, application);
    }

    public List<InterviewResource> toResources(Collection<Interview> interviews) {
        Map<Long, Application> applications =
                applicationRepository
                        .findAllById(
                                interviews.stream()
                                        .map(Interview::getApplicationId)
                                        .distinct()
                                        .toList())
                        .stream()
                        .collect(Collectors.toMap(Application::getId, Function.identity()));
        return interviews.stream()
                .map(
                        interview ->
                                toResource(
                                        interview, applications.get(interview.getApplicationId())))
                .toList();
    }

    public InterviewResource toResource(Interview interview, Application application) {
        return InterviewResource.builder()
                .id(interview.getId())
                .applicationId(interview.getApplicationId())
                .jobId(application.getJobId())
                .jobTitle(application.getJobTitle())
                .companyName(application.getCompanyName())
                .candidateName(application.getCandidateName())
                .startsAt(interview.getStartsAt())
                .durationMinutes(interview.getDurationMinutes())
                .format(interview.getFormat())
                .location(interview.getLocation())
                .note(interview.getNote())
                .status(interview.getStatus())
                .proposedStartsAt(interview.getProposedStartsAt())
                .candidateMessage(interview.getCandidateMessage())
                .cancelReason(interview.getCancelReason())
                .createdAt(interview.getCreatedAt())
                .build();
    }
}
