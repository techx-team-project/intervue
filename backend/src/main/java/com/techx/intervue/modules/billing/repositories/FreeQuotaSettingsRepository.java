package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.FreeQuotaSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FreeQuotaSettingsRepository extends JpaRepository<FreeQuotaSettings, Long> {

    Optional<FreeQuotaSettings> findFirstByOrderByIdAsc();
}
