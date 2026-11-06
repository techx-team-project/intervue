package com.techx.intervue.modules.content.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.content.enums.BlogPostStatus;
import com.techx.intervue.modules.content.requests.AdminSearchBlogRequest;
import com.techx.intervue.modules.content.requests.CreateBlogPostRequest;
import com.techx.intervue.modules.content.requests.UpdateBlogPostRequest;
import com.techx.intervue.modules.content.resources.AdminBlogSummaryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface AdminBlogServiceInterface {

    AdminBlogSummaryResource getSummary();

    Page<BlogPostListResource> searchPosts(AdminSearchBlogRequest request, Pageable pageable);

    BlogPostDetailResource getPostById(Long id);

    BlogPostDetailResource createPost(CreateBlogPostRequest request, RequestActor actor);

    BlogPostDetailResource updatePost(Long id, UpdateBlogPostRequest request, RequestActor actor);

    BlogPostDetailResource updateStatus(Long id, BlogPostStatus status, RequestActor actor);

    BlogPostDetailResource toggleFeatured(Long id, RequestActor actor);

    void deletePost(Long id, RequestActor actor);

    UploadedCoverResource uploadCoverImage(MultipartFile file);

    record UploadedCoverResource(String url, String publicId) {}
}
