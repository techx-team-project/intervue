package com.techx.intervue.modules.entitlement.services.interfaces;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.util.List;

public interface EntitlementServiceInterface {

    record EntitlementGrant(
            Long sourceOrderItemId,
            EntitlementType type,
            Integer quantity,
            Integer tier,
            Integer durationDays,
            String label) {}

    void grant(Long companyId, Long recruiterId, List<EntitlementGrant> grants);

    boolean consumeJobSlot(Long companyId, Long jobId, Long recruiterId);
}
