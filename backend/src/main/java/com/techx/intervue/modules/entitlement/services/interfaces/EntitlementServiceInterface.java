package com.techx.intervue.modules.entitlement.services.interfaces;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.time.Duration;
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
            String label,
            Integer packageValidityDays,
            Instant explicitDeadline,
            boolean bonus) {

        public static EntitlementGrant fromOrderItem(
                Long sourceOrderItemId,
                EntitlementType type,
                Integer quantity,
                Integer tier,
                Integer durationDays,
                String label,
                Integer packageValidityDays,
                boolean bonus) {
            return new EntitlementGrant(
                    sourceOrderItemId,
                    type,
                    quantity,
                    tier,
                    durationDays,
                    label,
                    packageValidityDays,
                    null,
                    bonus);
        }

        public static EntitlementGrant direct(
                EntitlementType type,
                Integer quantity,
                Integer tier,
                Integer durationDays,
                String label,
                Instant explicitDeadline) {
            return new EntitlementGrant(
                    null, type, quantity, tier, durationDays, label, null, explicitDeadline, false);
        }
    }

    void grant(Long companyId, Long recruiterId, List<EntitlementGrant> grants);

    /** Returns the duration the consumed slot allows, or empty when no slot was available. */
    Optional<Integer> consumeJobSlot(Long companyId, Long jobId, Long recruiterId);

    /** Returns when the consumed job slot usage expires for the given job, if recorded. */
    Optional<Instant> jobSlotExpiresAt(Long jobId);

    /**
     * Pushes the job slot end back by the paused time and returns the new end, if the job has a
     * slot.
     */
    Optional<Instant> extendJobSlot(Long jobId, Duration pausedFor);

    /** Spends one retop unit against the given job and records an ended usage entry. */
    boolean consumeRetop(Long companyId, Long jobId, Long recruiterId);

    /** Companies from the given set that still hold an unused alert-priority slot. */
    Set<Long> companiesWithAlertPush(Collection<Long> companyIds);

    /** Spends one alert-priority slot; false when the company had none left. */
    boolean consumeAlertPush(Long companyId, Long jobId);

    /** Units of a type the company still holds, without spending anything. */
    int remainingOf(Long companyId, EntitlementType type);

    /** When the soonest-expiring lot of a type runs out, or empty when none is time-limited. */
    Optional<Instant> nearestExpiryOf(Long companyId, EntitlementType type);

    /** Spends one unit of a type not tied to a job; false when the company had none left. */
    boolean consumeUnit(Long companyId, EntitlementType type);

    /**
     * Consumes from the exact lot one order line produced, instead of drawing FIFO across the
     * company's whole stock.
     */
    void consumeFromOrderItem(Long sourceOrderItemId, int amount);

    /** What an order line delivered and how much of it is still untouched. */
    record UnusedUnits(
            Long sourceOrderItemId,
            EntitlementType type,
            int tier,
            boolean bonus,
            int totalQuantity,
            int remainingQuantity) {}

    List<UnusedUnits> unusedFromOrderItems(Collection<Long> orderItemIds);

    /** Takes back the units of those order lines that were never activated. */
    void revokeUnusedFromOrderItems(Collection<Long> orderItemIds);
}
