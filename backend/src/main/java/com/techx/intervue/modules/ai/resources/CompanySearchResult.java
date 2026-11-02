package com.techx.intervue.modules.ai.resources;

import java.util.List;

public record CompanySearchResult(
        String id,
        String name,
        String industry,
        String size,
        String address,
        String website,
        boolean isVerified,
        int openJobsCount,
        List<String> highlights,
        String detailUrl) {}
