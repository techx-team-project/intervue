package com.techx.intervue.modules.application.resources;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.util.Map;

public record ApplicationStatusCountsResource(long total, Map<ApplicationStatus, Long> byStatus) {}
