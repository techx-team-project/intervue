package com.techx.intervue.modules.application.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.resources.ScreeningQuestionResource;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApplyFormResource(
        Long jobId,
        String jobTitle,
        String companyName,
        boolean open,
        List<ScreeningQuestionResource> questions,
        ApplicationResource application) {}
