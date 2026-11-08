package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ScreeningQuestionResource(
        Long id,
        ScreeningQuestionType type,
        String prompt,
        boolean required,
        List<String> options) {}
