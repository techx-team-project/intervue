package com.techx.intervue.modules.content.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.content.entities.BlogCategory;
import com.techx.intervue.modules.content.entities.BlogPost;
import com.techx.intervue.modules.content.entities.BlogTag;
import com.techx.intervue.modules.content.enums.BlogPostStatus;
import com.techx.intervue.modules.content.mappers.BlogMapper;
import com.techx.intervue.modules.content.repositories.BlogCategoryRepository;
import com.techx.intervue.modules.content.repositories.BlogPostRepository;
import com.techx.intervue.modules.content.requests.SearchBlogPostRequest;
import com.techx.intervue.modules.content.resources.BlogCategoryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import com.techx.intervue.modules.content.services.interfaces.BlogServiceInterface;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlogService implements BlogServiceInterface {

    private final BlogCategoryRepository categoryRepository;
    private final BlogPostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BlogCategoryResource> listActiveCategories() {
        return categoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(
                        cat -> {
                            long count =
                                    postRepository.countByCategoryIdAndStatus(
                                            cat.getId(), BlogPostStatus.PUBLISHED);
                            return BlogMapper.toCategoryResource(cat, count);
                        })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BlogCategoryResource getCategoryBySlug(String slug) {
        BlogCategory cat =
                categoryRepository
                        .findBySlug(slug)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_CATEGORY_NOT_FOUND));
        long count =
                postRepository.countByCategoryIdAndStatus(cat.getId(), BlogPostStatus.PUBLISHED);
        return BlogMapper.toCategoryResource(cat, count);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostListResource> searchPosts(
            SearchBlogPostRequest request, Pageable pageable) {
        Specification<BlogPost> spec =
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();
                    predicates.add(cb.equal(root.get("status"), BlogPostStatus.PUBLISHED));
                    predicates.add(cb.isNull(root.get("deletedAt")));

                    if (request.categorySlug() != null && !request.categorySlug().isBlank()) {
                        Join<BlogPost, BlogCategory> catJoin =
                                root.join("category", JoinType.INNER);
                        predicates.add(
                                cb.equal(catJoin.get("slug"), request.categorySlug().trim()));
                    }

                    if (request.keyword() != null && !request.keyword().isBlank()) {
                        String pattern = "%" + request.keyword().trim().toLowerCase() + "%";
                        Predicate titlePred = cb.like(cb.lower(root.get("title")), pattern);
                        Predicate excerptPred = cb.like(cb.lower(root.get("excerpt")), pattern);
                        predicates.add(cb.or(titlePred, excerptPred));
                    }

                    if (request.tag() != null && !request.tag().isBlank()) {
                        Join<BlogPost, BlogTag> tagJoin = root.join("tags", JoinType.INNER);
                        String tagQuery = request.tag().trim().toLowerCase();
                        Predicate tagSlugPred = cb.equal(cb.lower(tagJoin.get("slug")), tagQuery);
                        Predicate tagNamePred = cb.equal(cb.lower(tagJoin.get("name")), tagQuery);
                        predicates.add(cb.or(tagSlugPred, tagNamePred));
                        query.distinct(true);
                    }

                    return cb.and(predicates.toArray(new Predicate[0]));
                };

        Pageable sortedPageable = pageable;
        if (pageable.getSort().isUnsorted()) {
            sortedPageable =
                    PageRequest.of(
                            pageable.getPageNumber(),
                            pageable.getPageSize(),
                            Sort.by(Sort.Direction.DESC, "publishedAt", "createdAt"));
        }

        return postRepository.findAll(spec, sortedPageable).map(BlogMapper::toListResource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostListResource> getFeaturedPosts() {
        return postRepository
                .findTop6ByIsFeaturedTrueAndStatusAndDeletedAtIsNullOrderByPublishedAtDesc(
                        BlogPostStatus.PUBLISHED)
                .stream()
                .map(BlogMapper::toListResource)
                .toList();
    }

    @Override
    @Transactional
    public BlogPostDetailResource getPostBySlug(String categorySlug, String slug) {
        BlogPost post =
                postRepository
                        .findBySlugAndStatusAndDeletedAtIsNull(slug, BlogPostStatus.PUBLISHED)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_POST_NOT_FOUND));

        postRepository.incrementViewsCount(post.getId());

        long categoryArticleCount =
                post.getCategory() != null
                        ? postRepository.countByCategoryIdAndStatus(
                                post.getCategory().getId(), BlogPostStatus.PUBLISHED)
                        : 0L;

        return BlogMapper.toDetailResource(post, categoryArticleCount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostListResource> getRelatedPosts(String categorySlug, String slug, int limit) {
        BlogPost post =
                postRepository
                        .findBySlugAndStatusAndDeletedAtIsNull(slug, BlogPostStatus.PUBLISHED)
                        .orElse(null);

        if (post == null || post.getCategory() == null) {
            return List.of();
        }

        return postRepository
                .findTop3ByCategoryIdAndIdNotAndStatusAndDeletedAtIsNullOrderByPublishedAtDesc(
                        post.getCategory().getId(), post.getId(), BlogPostStatus.PUBLISHED)
                .stream()
                .map(BlogMapper::toListResource)
                .toList();
    }
}
