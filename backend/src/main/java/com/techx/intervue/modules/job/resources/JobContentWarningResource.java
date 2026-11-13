package com.techx.intervue.modules.job.resources;

import java.util.List;

public record JobContentWarningResource(String field, String severity, List<String> terms) {}
