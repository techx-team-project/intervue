package com.techx.intervue.modules.entitlement.services.interfaces;

import com.techx.intervue.modules.entitlement.requests.ActivateEntitlementRequest;
import com.techx.intervue.modules.entitlement.resources.EntitlementResource;
import com.techx.intervue.modules.entitlement.resources.EntitlementUsageResource;
import java.util.List;

public interface RecruiterEntitlementServiceInterface {

    List<EntitlementResource> listStock(Long recruiterId);

    List<EntitlementUsageResource> listActive(Long recruiterId);

    EntitlementResource activate(
            Long entitlementId, ActivateEntitlementRequest request, Long recruiterId);
}
