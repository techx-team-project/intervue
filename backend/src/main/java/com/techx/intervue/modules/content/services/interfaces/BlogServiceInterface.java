package com.techx.intervue.modules.content.services.interfaces;

import com.techx.intervue.modules.content.requests.SearchBlogPostRequest;
import com.techx.intervue.modules.content.resources.BlogCategoryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogServiceInterface {

    List<BlogCategoryResource> listActiveCategories();

    BlogCategoryResource getCategoryBySlug(String slug);

    Page<BlogPostListResource> searchPosts(SearchBlogPostRequest request, Pageable pageable);

    List<BlogPostListResource> getFeaturedPosts();

    BlogPostDetailResource getPostBySlug(String categorySlug, String slug);

    List<BlogPostListResource> getRelatedPosts(String categorySlug, String slug, int limit);
}
