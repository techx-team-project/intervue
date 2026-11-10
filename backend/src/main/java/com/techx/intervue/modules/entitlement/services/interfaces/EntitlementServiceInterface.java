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
     * than leaving part of the stock consumed. {@code note} records what the draw was for (e.g. the
     * credit conversion's target package) so the usage ledger can show it; pass null if there is
     * nothing more specific than the entitlement type itself.
     */
    void consumeUnits(Long companyId, EntitlementType type, int amount, String note);

    /**
     * Consumes from the exact lot one order line produced, instead of drawing FIFO across the
     * company's whole stock. Used when consumption must track a single booking rather than being
     * fungible (e.g. a banner week), so the refund calculation for other order lines of the same
     * company stays unaffected.
     */
    void consumeFromOrderItem(Long sourceOrderItemId, int amount);

    /** What an order line delivered and how much of it is still untouched. */
    record UnusedUnits(Long sourceOrderItemId, int totalQuantity, int remainingQuantity) {}

    List<UnusedUnits> unusedFromOrderItems(Collection<Long> orderItemIds);

    /** Takes back the units of those order lines that were never activated. */
    void revokeUnusedFromOrderItems(Collection<Long> orderItemIds);

    /** One statement line: a grant received (credit) or a usage spent (debit). */
    record LedgerEntry(boolean credit, int quantity, String label, Instant at) {}

    /** Every grant and usage of a type for a company, newest first. */
    List<LedgerEntry> ledgerOf(Long companyId, EntitlementType type);
}
