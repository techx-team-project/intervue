package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import java.util.List;

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
}
