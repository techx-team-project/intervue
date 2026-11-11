package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileDiffItem(
        String field, String label, Object oldValue, Object newValue, boolean hasChange) {}
