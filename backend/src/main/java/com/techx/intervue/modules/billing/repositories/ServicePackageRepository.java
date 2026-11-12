package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServicePackageRepository
        extends JpaRepository<ServicePackage, Long>, JpaSpecificationExecutor<ServicePackage> {

    interface CategoryPackageCounts {
        Long getCategoryId();

        Long getTotalCount();

        Long getActiveCount();
    }

    @EntityGraph(attributePaths = "category")
    List<ServicePackage> findAllByStatusOrderByDisplayOrderAsc(ServicePackageStatus status);

    @EntityGraph(attributePaths = "category")
    List<ServicePackage> findAllByStatusAndCategoryIsActiveTrueOrderByDisplayOrderAsc(
            ServicePackageStatus status);

    @EntityGraph(attributePaths = "category")
    Optional<ServicePackage> findBySlugAndStatus(String slug, ServicePackageStatus status);

    @Query(
            """
            SELECT p.category.id AS categoryId,
                   COUNT(p) AS totalCount,
                   COUNT(CASE WHEN p.status = :activeStatus THEN 1 ELSE null END) AS activeCount
            FROM ServicePackage p
            GROUP BY p.category.id
            """)
    List<CategoryPackageCounts> countPackagesByCategory(
            @Param("activeStatus") ServicePackageStatus activeStatus);

    long countByCategoryId(Long categoryId);

    long countByCategoryIdAndStatus(Long categoryId, ServicePackageStatus status);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
