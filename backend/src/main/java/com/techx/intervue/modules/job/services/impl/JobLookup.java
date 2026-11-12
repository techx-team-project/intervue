package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobLookup implements JobLookupInterface {

    private static final Set<JobStatus> HIDDEN_FROM_APPLICANTS =
            Set.of(JobStatus.DRAFT, JobStatus.PENDING_REVIEW);

    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public ApplyTarget requireApplyTarget(Long jobId) {
        Job job =
                jobRepository
                        .findWithScreeningQuestionsById(jobId)
                        .filter(found -> !HIDDEN_FROM_APPLICANTS.contains(found.getStatus()))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        boolean open =
                job.getStatus() == JobStatus.PUBLISHED
                        && job.getDeadline() != null
                        && !job.getDeadline().isBefore(JobDeadlines.today());
        return new ApplyTarget(
                job.getId(),
                job.getTitle(),
                job.getCompanyId(),
                job.getCompanyName(),
                job.getRecruiterId(),
                open,
                job.getScreeningQuestions().stream()
                        .map(
                                question ->
                                        new ApplyQuestion(
                                                question.getId(),
                                                question.getType(),
                                                question.getPrompt(),
                                                question.isRequired(),
                                                question.getOptions() == null
                                                        ? List.of()
                                                        : question.getOptions()))
                        .toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> findOpenJobIdsClosingOn(LocalDate day) {
        return jobRepository.findIdsByStatusAndDeadline(JobStatus.PUBLISHED, day);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, Long> findRecruiterIdsByJobIds(Collection<Long> jobIds) {
        return jobRepository.findAllById(jobIds).stream()
                .collect(Collectors.toMap(Job::getId, Job::getRecruiterId));
    }
}
