package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ServicePackageRepository
        extends JpaRepository<ServicePackage, Long>, JpaSpecificationExecutor<ServicePackage> {

    @EntityGraph(attributePaths = "category")
    List<ServicePackage> findAllByStatusOrderByDisplayOrderAsc(ServicePackageStatus status);

    @EntityGraph(attributePaths = "category")
    Optional<ServicePackage> findBySlugAndStatus(String slug, ServicePackageStatus status);

    long countByCategoryId(Long categoryId);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
