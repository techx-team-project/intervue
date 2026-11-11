package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.BillingSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillingSettingsRepository extends JpaRepository<BillingSettings, Long> {

    Optional<BillingSettings> findFirstByOrderByIdAsc();
}
