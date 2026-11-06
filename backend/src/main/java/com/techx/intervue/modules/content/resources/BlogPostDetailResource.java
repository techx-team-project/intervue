package com.techx.intervue.modules.content.resources;

import com.techx.intervue.modules.content.enums.BlogPostStatus;
import java.time.Instant;
import java.util.List;

public record BlogPostDetailResource(
        Long id,
        String slug,
        String title,
        String excerpt,
        String content,
        String coverImageUrl,
        String coverImagePublicId,
        BlogPostStatus status,
        Boolean isFeatured,
        Integer readTimeMinutes,
        Long viewsCount,
        String metaTitle,
        String metaDescription,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt,
        BlogCategoryResource category,
        AuthorResource author,
        List<String> tags) {

    public record AuthorResource(Long id, String name, String avatar, String role) {}
}
