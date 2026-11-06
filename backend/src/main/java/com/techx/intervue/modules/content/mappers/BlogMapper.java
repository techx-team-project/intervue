package com.techx.intervue.modules.content.mappers;

import com.techx.intervue.modules.content.entities.BlogCategory;
import com.techx.intervue.modules.content.entities.BlogPost;
import com.techx.intervue.modules.content.entities.BlogTag;
import com.techx.intervue.modules.content.resources.BlogCategoryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import java.util.Collections;
import java.util.List;

public final class BlogMapper {

    private BlogMapper() {}

    public static BlogCategoryResource toCategoryResource(
            BlogCategory category, Long articleCount) {
        if (category == null) return null;
        return new BlogCategoryResource(
                category.getId(),
                category.getSlug(),
                category.getName(),
                category.getDescription(),
                category.getIconName(),
                category.getAccentColor(),
                category.getBannerGradient(),
                category.getDisplayOrder(),
                articleCount != null ? articleCount : 0L);
    }

    public static BlogPostListResource toListResource(BlogPost post) {
        if (post == null) return null;
        List<String> tags =
                post.getTags() != null
                        ? post.getTags().stream().map(BlogTag::getName).sorted().toList()
                        : Collections.emptyList();

        String authorName = post.getAuthorName();
        String authorAvatar = post.getAuthorAvatar();
        String authorRole = post.getAuthorRole();

        if (authorName == null && post.getAuthor() != null) {
            authorName = post.getAuthor().getName();
            authorAvatar = post.getAuthor().getImage();
            authorRole = "Biên tập viên";
        }

        return new BlogPostListResource(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getExcerpt(),
                post.getCoverImageUrl(),
                post.getStatus(),
                post.getIsFeatured(),
                post.getReadTimeMinutes(),
                post.getViewsCount(),
                post.getPublishedAt(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getCategory() != null ? post.getCategory().getSlug() : null,
                post.getCategory() != null ? post.getCategory().getName() : null,
                authorName,
                authorAvatar,
                authorRole,
                tags);
    }

    public static BlogPostDetailResource toDetailResource(
            BlogPost post, Long categoryArticleCount) {
        if (post == null) return null;
        List<String> tags =
                post.getTags() != null
                        ? post.getTags().stream().map(BlogTag::getName).sorted().toList()
                        : Collections.emptyList();

        String authorName = post.getAuthorName();
        String authorAvatar = post.getAuthorAvatar();
        String authorRole = post.getAuthorRole();
        Long authorId = null;

        if (post.getAuthor() != null) {
            authorId = post.getAuthor().getId();
            if (authorName == null) {
                authorName = post.getAuthor().getName();
                authorAvatar = post.getAuthor().getImage();
                authorRole = "Biên tập viên InterVue";
            }
        }

        return new BlogPostDetailResource(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getExcerpt(),
                post.getContent(),
                post.getCoverImageUrl(),
                post.getCoverImagePublicId(),
                post.getStatus(),
                post.getIsFeatured(),
                post.getReadTimeMinutes(),
                post.getViewsCount(),
                post.getMetaTitle(),
                post.getMetaDescription(),
                post.getPublishedAt(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                toCategoryResource(post.getCategory(), categoryArticleCount),
                new BlogPostDetailResource.AuthorResource(
                        authorId, authorName, authorAvatar, authorRole),
                tags);
    }
}
