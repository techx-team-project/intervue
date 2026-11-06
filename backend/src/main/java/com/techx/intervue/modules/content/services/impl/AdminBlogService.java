package com.techx.intervue.modules.content.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.content.entities.BlogCategory;
import com.techx.intervue.modules.content.entities.BlogPost;
import com.techx.intervue.modules.content.entities.BlogTag;
import com.techx.intervue.modules.content.enums.BlogPostStatus;
import com.techx.intervue.modules.content.mappers.BlogMapper;
import com.techx.intervue.modules.content.repositories.BlogCategoryRepository;
import com.techx.intervue.modules.content.repositories.BlogPostRepository;
import com.techx.intervue.modules.content.repositories.BlogTagRepository;
import com.techx.intervue.modules.content.requests.AdminSearchBlogRequest;
import com.techx.intervue.modules.content.requests.CreateBlogPostRequest;
import com.techx.intervue.modules.content.requests.UpdateBlogPostRequest;
import com.techx.intervue.modules.content.resources.AdminBlogSummaryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import com.techx.intervue.modules.content.services.interfaces.AdminBlogServiceInterface;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.repositories.UserRepository;
import jakarta.persistence.criteria.Predicate;
import java.text.Normalizer;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AdminBlogService implements AdminBlogServiceInterface {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern EDGESDHASHES = Pattern.compile("(^-|-$)");

    private final BlogCategoryRepository categoryRepository;
    private final BlogPostRepository postRepository;
    private final BlogTagRepository tagRepository;
    private final UserRepository userRepository;
    private final StorageServiceInterface storageService;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public AdminBlogSummaryResource getSummary() {
        long total = postRepository.count((root, query, cb) -> cb.isNull(root.get("deletedAt")));
        long published = postRepository.countByStatusAndDeletedAtIsNull(BlogPostStatus.PUBLISHED);
        long draft = postRepository.countByStatusAndDeletedAtIsNull(BlogPostStatus.DRAFT);
        long totalViews = postRepository.sumTotalViews();
        return new AdminBlogSummaryResource(total, published, draft, totalViews);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostListResource> searchPosts(
            AdminSearchBlogRequest request, Pageable pageable) {
        Specification<BlogPost> spec =
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();
                    predicates.add(cb.isNull(root.get("deletedAt")));

                    if (request.categoryId() != null) {
                        predicates.add(
                                cb.equal(root.get("category").get("id"), request.categoryId()));
                    }

                    if (request.status() != null) {
                        predicates.add(cb.equal(root.get("status"), request.status()));
                    }

                    if (request.isFeatured() != null) {
                        predicates.add(cb.equal(root.get("isFeatured"), request.isFeatured()));
                    }

                    if (request.keyword() != null && !request.keyword().isBlank()) {
                        String pattern = "%" + request.keyword().trim().toLowerCase() + "%";
                        Predicate titlePred = cb.like(cb.lower(root.get("title")), pattern);
                        Predicate excerptPred = cb.like(cb.lower(root.get("excerpt")), pattern);
                        predicates.add(cb.or(titlePred, excerptPred));
                    }

                    return cb.and(predicates.toArray(new Predicate[0]));
                };

        Pageable sortedPageable = pageable;
        if (pageable.getSort().isUnsorted()) {
            sortedPageable =
                    PageRequest.of(
                            pageable.getPageNumber(),
                            pageable.getPageSize(),
                            Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return postRepository.findAll(spec, sortedPageable).map(BlogMapper::toListResource);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogPostDetailResource getPostById(Long id) {
        BlogPost post =
                postRepository
                        .findById(id)
                        .filter(p -> p.getDeletedAt() == null)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_POST_NOT_FOUND));

        long categoryArticleCount =
                post.getCategory() != null
                        ? postRepository.countByCategoryIdAndStatus(
                                post.getCategory().getId(), BlogPostStatus.PUBLISHED)
                        : 0L;

        return BlogMapper.toDetailResource(post, categoryArticleCount);
    }

    @Override
    @Transactional
    public BlogPostDetailResource createPost(CreateBlogPostRequest request, RequestActor actor) {
        BlogCategory category =
                categoryRepository
                        .findById(request.categoryId())
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_CATEGORY_NOT_FOUND));

        User author =
                actor != null && actor.userId() != null
                        ? userRepository.findById(actor.userId()).orElse(null)
                        : null;

        String slug = generateSlug(request.slug(), request.title(), null);
        BlogPostStatus status = request.status() != null ? request.status() : BlogPostStatus.DRAFT;
        Instant publishedAt = status == BlogPostStatus.PUBLISHED ? Instant.now() : null;

        Set<BlogTag> tags = resolveTags(request.tags());

        BlogPost post =
                BlogPost.builder()
                        .category(category)
                        .author(author)
                        .authorName(
                                request.authorName() != null && !request.authorName().isBlank()
                                        ? request.authorName().trim()
                                        : (author != null
                                                ? author.getName()
                                                : "Ban Biên Tập InterVue"))
                        .authorAvatar(author != null ? author.getImage() : null)
                        .authorRole(
                                request.authorRole() != null && !request.authorRole().isBlank()
                                        ? request.authorRole().trim()
                                        : "Biên tập viên")
                        .slug(slug)
                        .title(request.title().trim())
                        .excerpt(request.excerpt().trim())
                        .content(request.content().trim())
                        .coverImageUrl(request.coverImageUrl())
                        .coverImagePublicId(request.coverImagePublicId())
                        .status(status)
                        .isFeatured(Boolean.TRUE.equals(request.isFeatured()))
                        .readTimeMinutes(
                                request.readTimeMinutes() != null && request.readTimeMinutes() > 0
                                        ? request.readTimeMinutes()
                                        : calculateReadTime(request.content()))
                        .viewsCount(0L)
                        .metaTitle(
                                request.metaTitle() != null
                                        ? request.metaTitle().trim()
                                        : request.title().trim())
                        .metaDescription(
                                request.metaDescription() != null
                                        ? request.metaDescription().trim()
                                        : request.excerpt().trim())
                        .publishedAt(publishedAt)
                        .tags(tags)
                        .build();

        BlogPost saved = postRepository.save(post);

        recordAudit(
                actor,
                AuditAction.BLOG_POST_CREATED,
                saved.getId(),
                "Created article: " + saved.getTitle());
        if (status == BlogPostStatus.PUBLISHED) {
            recordAudit(
                    actor,
                    AuditAction.BLOG_POST_PUBLISHED,
                    saved.getId(),
                    "Published article: " + saved.getTitle());
        }

        long categoryArticleCount =
                postRepository.countByCategoryIdAndStatus(
                        category.getId(), BlogPostStatus.PUBLISHED);
        return BlogMapper.toDetailResource(saved, categoryArticleCount);
    }

    @Override
    @Transactional
    public BlogPostDetailResource updatePost(
            Long id, UpdateBlogPostRequest request, RequestActor actor) {
        BlogPost post =
                postRepository
                        .findById(id)
                        .filter(p -> p.getDeletedAt() == null)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_POST_NOT_FOUND));

        BlogCategory category =
                categoryRepository
                        .findById(request.categoryId())
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_CATEGORY_NOT_FOUND));

        String slug = generateSlug(request.slug(), request.title(), id);

        BlogPostStatus newStatus = request.status() != null ? request.status() : post.getStatus();
        if (newStatus == BlogPostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(Instant.now());
        }

        post.setCategory(category);
        post.setSlug(slug);
        post.setTitle(request.title().trim());
        post.setExcerpt(request.excerpt().trim());
        post.setContent(request.content().trim());
        if (request.coverImageUrl() != null) {
            post.setCoverImageUrl(request.coverImageUrl());
            post.setCoverImagePublicId(request.coverImagePublicId());
        }
        post.setStatus(newStatus);
        post.setIsFeatured(Boolean.TRUE.equals(request.isFeatured()));
        post.setReadTimeMinutes(
                request.readTimeMinutes() != null && request.readTimeMinutes() > 0
                        ? request.readTimeMinutes()
                        : calculateReadTime(request.content()));
        post.setMetaTitle(
                request.metaTitle() != null ? request.metaTitle().trim() : request.title().trim());
        post.setMetaDescription(
                request.metaDescription() != null
                        ? request.metaDescription().trim()
                        : request.excerpt().trim());
        if (request.authorName() != null && !request.authorName().isBlank()) {
            post.setAuthorName(request.authorName().trim());
        }
        if (request.authorRole() != null && !request.authorRole().isBlank()) {
            post.setAuthorRole(request.authorRole().trim());
        }

        Set<BlogTag> tags = resolveTags(request.tags());
        post.setTags(tags);

        BlogPost updated = postRepository.save(post);

        recordAudit(
                actor,
                AuditAction.BLOG_POST_UPDATED,
                updated.getId(),
                "Updated article: " + updated.getTitle());
        if (newStatus == BlogPostStatus.PUBLISHED && post.getStatus() != BlogPostStatus.PUBLISHED) {
            recordAudit(
                    actor,
                    AuditAction.BLOG_POST_PUBLISHED,
                    updated.getId(),
                    "Published article: " + updated.getTitle());
        }

        long categoryArticleCount =
                postRepository.countByCategoryIdAndStatus(
                        category.getId(), BlogPostStatus.PUBLISHED);
        return BlogMapper.toDetailResource(updated, categoryArticleCount);
    }

    @Override
    @Transactional
    public BlogPostDetailResource updateStatus(Long id, BlogPostStatus status, RequestActor actor) {
        BlogPost post =
                postRepository
                        .findById(id)
                        .filter(p -> p.getDeletedAt() == null)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_POST_NOT_FOUND));

        if (status == BlogPostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(Instant.now());
        }
        post.setStatus(status);
        BlogPost updated = postRepository.save(post);

        recordAudit(
                actor,
                status == BlogPostStatus.PUBLISHED
                        ? AuditAction.BLOG_POST_PUBLISHED
                        : AuditAction.BLOG_POST_UPDATED,
                updated.getId(),
                "Status changed to: " + status);

        long categoryArticleCount =
                post.getCategory() != null
                        ? postRepository.countByCategoryIdAndStatus(
                                post.getCategory().getId(), BlogPostStatus.PUBLISHED)
                        : 0L;
        return BlogMapper.toDetailResource(updated, categoryArticleCount);
    }

    @Override
    @Transactional
    public BlogPostDetailResource toggleFeatured(Long id, RequestActor actor) {
        BlogPost post =
                postRepository
                        .findById(id)
                        .filter(p -> p.getDeletedAt() == null)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_POST_NOT_FOUND));

        post.setIsFeatured(!Boolean.TRUE.equals(post.getIsFeatured()));
        BlogPost updated = postRepository.save(post);

        recordAudit(
                actor,
                AuditAction.BLOG_POST_UPDATED,
                updated.getId(),
                "Featured toggled to: " + updated.getIsFeatured());

        long categoryArticleCount =
                post.getCategory() != null
                        ? postRepository.countByCategoryIdAndStatus(
                                post.getCategory().getId(), BlogPostStatus.PUBLISHED)
                        : 0L;
        return BlogMapper.toDetailResource(updated, categoryArticleCount);
    }

    @Override
    @Transactional
    public void deletePost(Long id, RequestActor actor) {
        BlogPost post =
                postRepository
                        .findById(id)
                        .filter(p -> p.getDeletedAt() == null)
                        .orElseThrow(() -> new AppException(ErrorCode.BLOG_POST_NOT_FOUND));

        post.setDeletedAt(Instant.now());
        postRepository.save(post);

        recordAudit(
                actor,
                AuditAction.BLOG_POST_DELETED,
                post.getId(),
                "Soft deleted article: " + post.getTitle());
    }

    @Override
    public UploadedCoverResource uploadCoverImage(MultipartFile file) {
        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, "blogs/covers");
        String url = storageService.publicImageUrl(stored.publicId());
        return new UploadedCoverResource(url, stored.publicId());
    }

    private String generateSlug(String customSlug, String title, Long excludeId) {
        String base = (customSlug != null && !customSlug.isBlank()) ? customSlug : title;
        String normalized = slugify(base);
        if (normalized.isBlank()) {
            normalized = "bai-viet-" + System.currentTimeMillis();
        }

        String candidate = normalized;
        int counter = 1;
        while (excludeId == null
                ? postRepository.existsBySlugAndDeletedAtIsNull(candidate)
                : postRepository.existsBySlugAndIdNotAndDeletedAtIsNull(candidate, excludeId)) {
            candidate = normalized + "-" + counter;
            counter++;
        }
        return candidate;
    }

    private String slugify(String input) {
        if (input == null) return "";
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        slug = EDGESDHASHES.matcher(slug).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    private Set<BlogTag> resolveTags(List<String> tagNames) {
        Set<BlogTag> tags = new HashSet<>();
        if (tagNames == null || tagNames.isEmpty()) return tags;

        for (String raw : tagNames) {
            String name = raw.trim();
            if (name.isBlank()) continue;
            String slug = slugify(name);
            if (slug.isBlank()) continue;

            BlogTag tag =
                    tagRepository
                            .findBySlug(slug)
                            .or(() -> tagRepository.findByNameIgnoreCase(name))
                            .orElseGet(
                                    () ->
                                            tagRepository.save(
                                                    BlogTag.builder()
                                                            .name(name)
                                                            .slug(slug)
                                                            .build()));
            tags.add(tag);
        }
        return tags;
    }

    private int calculateReadTime(String content) {
        if (content == null || content.isBlank()) return 3;
        int wordCount = content.split("\\s+").length;
        int minutes = (int) Math.ceil((double) wordCount / 200.0);
        return Math.max(minutes, 3);
    }

    private void recordAudit(RequestActor actor, AuditAction action, Long targetId, String detail) {
        if (actor == null) return;
        auditLogService.record(
                new AuditEntry(
                        AuditActorType.ADMIN,
                        actor.userId(),
                        actor.email(),
                        action,
                        AuditTargetType.BLOG_POST,
                        targetId,
                        null,
                        detail,
                        actor.ip()));
    }
}
