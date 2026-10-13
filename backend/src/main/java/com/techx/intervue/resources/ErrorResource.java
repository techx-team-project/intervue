package com.techx.intervue.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResource {
    private String code;
    @Builder.Default private List<FieldErrorResource> details = List.of();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Map<String, Object> meta = Map.of();
}
