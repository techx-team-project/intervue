package com.techx.intervue.modules.content.resources;

import com.techx.intervue.modules.content.enums.BlogPostStatus;
import java.time.Instant;
import java.util.List;

public record BlogPostListResource(
        Long id,
        String slug,
        String title,
        String excerpt,
        String coverImageUrl,
        BlogPostStatus status,
        Boolean isFeatured,
        Integer readTimeMinutes,
        Long viewsCount,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt,
        String categorySlug,
        String categoryName,
        String authorName,
        String authorAvatar,
        String authorRole,
        List<String> tags) {}
