package com.techx.intervue.modules.content.resources;

public record AdminBlogSummaryResource(
        long totalArticles, long publishedArticles, long draftArticles, long totalViews) {}
