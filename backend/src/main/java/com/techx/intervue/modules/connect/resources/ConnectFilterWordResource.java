package com.techx.intervue.modules.connect.resources;

import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import com.techx.intervue.modules.connect.enums.FilterScope;
import java.time.Instant;
import lombok.Builder;

@Builder
public record ConnectFilterWordResource(
        Long id,
        String pattern,
        FilterScope scope,
        boolean regex,
        ConnectFilterSeverity severity,
        boolean active,
        String note,
        Instant createdAt,
        Instant updatedAt) {}
