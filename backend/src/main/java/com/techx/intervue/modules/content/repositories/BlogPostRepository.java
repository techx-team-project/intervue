package com.techx.intervue.modules.content.repositories;

import com.techx.intervue.modules.content.entities.BlogPost;
import com.techx.intervue.modules.content.enums.BlogPostStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository
        extends JpaRepository<BlogPost, Long>, JpaSpecificationExecutor<BlogPost> {

    Optional<BlogPost> findBySlugAndDeletedAtIsNull(String slug);

    Optional<BlogPost> findBySlugAndStatusAndDeletedAtIsNull(String slug, BlogPostStatus status);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    boolean existsBySlugAndIdNotAndDeletedAtIsNull(String slug, Long id);

    List<BlogPost> findTop5ByStatusAndDeletedAtIsNullOrderByViewsCountDesc(BlogPostStatus status);

    List<BlogPost> findTop6ByIsFeaturedTrueAndStatusAndDeletedAtIsNullOrderByPublishedAtDesc(
            BlogPostStatus status);

    List<BlogPost> findTop3ByCategoryIdAndIdNotAndStatusAndDeletedAtIsNullOrderByPublishedAtDesc(
            Long categoryId, Long excludeId, BlogPostStatus status);

    @Modifying
    @Query("UPDATE BlogPost b SET b.viewsCount = b.viewsCount + 1 WHERE b.id = :id")
    void incrementViewsCount(@Param("id") Long id);

    long countByStatusAndDeletedAtIsNull(BlogPostStatus status);

    @Query("SELECT COALESCE(SUM(b.viewsCount), 0) FROM BlogPost b WHERE b.deletedAt IS NULL")
    long sumTotalViews();

    @Query(
            "SELECT COUNT(b) FROM BlogPost b WHERE b.category.id = :categoryId AND b.status = :status AND b.deletedAt IS NULL")
    long countByCategoryIdAndStatus(
            @Param("categoryId") Long categoryId, @Param("status") BlogPostStatus status);
}
