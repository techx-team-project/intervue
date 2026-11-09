package com.techx.intervue.modules.entitlement.services.interfaces;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface EntitlementServiceInterface {

    record EntitlementGrant(
            Long sourceOrderItemId,
            EntitlementType type,
            Integer quantity,
            Integer tier,
            Integer durationDays,
            String label) {}

    void grant(Long companyId, Long recruiterId, List<EntitlementGrant> grants);

    /** Returns the duration the consumed slot allows, or empty when no slot was available. */
    Optional<Integer> consumeJobSlot(Long companyId, Long jobId, Long recruiterId);

    /** Companies from the given set that still hold an unused alert-priority slot. */
    Set<Long> companiesWithAlertPush(Collection<Long> companyIds);

    /** Spends one alert-priority slot; false when the company had none left. */
    boolean consumeAlertPush(Long companyId, Long jobId);
}
