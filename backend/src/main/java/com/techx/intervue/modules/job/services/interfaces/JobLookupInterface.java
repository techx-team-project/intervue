package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface JobLookupInterface {

    record ApplyQuestion(
            Long id,
            ScreeningQuestionType type,
            String prompt,
            boolean required,
            List<String> options) {}

    record ApplyTarget(
            Long jobId,
            String title,
            Long companyId,
            String companyName,
            Long recruiterId,
            boolean open,
            List<ApplyQuestion> questions) {}

    ApplyTarget requireApplyTarget(Long jobId);

    List<Long> findOpenJobIdsClosingOn(LocalDate day);

    Map<Long, Long> findRecruiterIdsByJobIds(Collection<Long> jobIds);
}
