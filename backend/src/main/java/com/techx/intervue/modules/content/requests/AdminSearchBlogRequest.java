package com.techx.intervue.modules.content.requests;

import com.techx.intervue.modules.content.enums.BlogPostStatus;

public record AdminSearchBlogRequest(
        String keyword, Long categoryId, BlogPostStatus status, Boolean isFeatured) {}
