package com.techx.intervue.modules.ai.resources;

import java.util.List;

public record JobSearchResult(
        String id,
        String title,
        String company,
        String salary,
        String location,
        String level,
        List<String> skills,
        String description,
        String detailUrl) {}
