package com.techx.intervue.modules.entitlement.services.interfaces;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.time.Instant;
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

    /** Units of a type the company still holds, without spending anything. */
    int remainingOf(Long companyId, EntitlementType type);

    /** When the soonest-expiring lot of a type runs out, or empty when the company holds none. */
    Optional<Instant> nearestExpiryOf(Long companyId, EntitlementType type);

    /** Spends one unit of a type not tied to a job; false when the company had none left. */
    boolean consumeUnit(Long companyId, EntitlementType type);

    /**
     * Spends several units at once, drawing across lots when one lot is too small. Throws
     * ENTITLEMENT_EXHAUSTED instead of returning, so a draw that cannot complete rolls back rather
     * than leaving part of the stock consumed.
     */
    void consumeUnits(Long companyId, EntitlementType type, int amount);
}
