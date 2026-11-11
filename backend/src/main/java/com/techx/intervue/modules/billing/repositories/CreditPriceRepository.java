package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.CreditPrice;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditPriceRepository extends JpaRepository<CreditPrice, Long> {

    List<CreditPrice> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    List<CreditPrice> findAllByOrderByDisplayOrderAsc();

    Optional<CreditPrice> findByEntitlementTypeAndTier(EntitlementType entitlementType, int tier);

    boolean existsByEntitlementTypeAndTier(EntitlementType entitlementType, int tier);
}
