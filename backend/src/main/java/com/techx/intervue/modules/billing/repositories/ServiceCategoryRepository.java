package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.ServiceCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    List<ServiceCategory> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    List<ServiceCategory> findAllByOrderByDisplayOrderAsc();

    Optional<ServiceCategory> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);
}
