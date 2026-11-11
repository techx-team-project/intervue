package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.ServicePackageSection;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicePackageSectionRepository
        extends JpaRepository<ServicePackageSection, Long> {

    List<ServicePackageSection> findAllByServicePackageIdOrderByDisplayOrderAsc(Long packageId);

    List<ServicePackageSection> findAllByServicePackageIdInOrderByDisplayOrderAsc(
            Collection<Long> packageIds);

    void deleteByServicePackageId(Long packageId);
}
