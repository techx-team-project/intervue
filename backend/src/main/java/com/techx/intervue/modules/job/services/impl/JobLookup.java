package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobLookup implements JobLookupInterface {

    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public ApplyTarget requireApplyTarget(Long jobId) {
        Job job =
                jobRepository
                        .findWithScreeningQuestionsById(jobId)
                        .filter(found -> found.getStatus() != JobStatus.DRAFT)
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
}
