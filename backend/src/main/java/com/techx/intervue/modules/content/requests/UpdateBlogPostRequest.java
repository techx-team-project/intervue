package com.techx.intervue.modules.content.requests;

import com.techx.intervue.modules.content.enums.BlogPostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateBlogPostRequest(
        @NotNull(message = "Category ID is required") Long categoryId,
        @NotBlank(message = "Title is required")
                @Size(max = 255, message = "Title cannot exceed 255 characters")
                String title,
        String slug,
        @NotBlank(message = "Excerpt is required") String excerpt,
        @NotBlank(message = "Content is required") String content,
        String coverImageUrl,
        String coverImagePublicId,
        BlogPostStatus status,
        Boolean isFeatured,
        Integer readTimeMinutes,
        String metaTitle,
        String metaDescription,
        String authorName,
        String authorRole,
        List<String> tags) {}
