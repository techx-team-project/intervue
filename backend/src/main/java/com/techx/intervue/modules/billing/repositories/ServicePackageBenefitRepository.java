package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.ServicePackageBenefit;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicePackageBenefitRepository
        extends JpaRepository<ServicePackageBenefit, Long> {

    List<ServicePackageBenefit> findAllByServicePackageIdInOrderByDisplayOrderAsc(
            Collection<Long> packageIds);

    List<ServicePackageBenefit> findAllByServicePackageIdOrderByDisplayOrderAsc(Long packageId);

    void deleteByServicePackageId(Long packageId);
}
