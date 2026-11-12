package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.util.EnumSet;
import java.util.Set;

final class EntitlementConfigRules {

    static final int MAX_DURATION_DAYS = 3650;

    static final Set<EntitlementType> DURATION_REQUIRED_TYPES =
            EnumSet.of(
                    EntitlementType.JOB_POST_SLOT,
                    EntitlementType.JOB_LABEL_HOT,
                    EntitlementType.JOB_HIGHLIGHT,
                    EntitlementType.BRAND_PAGE,
                    EntitlementType.FEATURED_COMPANY,
                    EntitlementType.AD_SLOT_WEEK);

    private EntitlementConfigRules() {}

    static void validateBenefit(int index, EntitlementType type, Integer durationDays) {
        validateCommon("benefits[" + index + "].durationDays", type, durationDays);
    }

    private static void validateCommon(
            String durationField, EntitlementType type, Integer durationDays) {
        if (type == null) {
            return;
        }
        if (DURATION_REQUIRED_TYPES.contains(type)) {
            if (durationDays == null || durationDays < 1 || durationDays > MAX_DURATION_DAYS) {
                throw AppException.validation(
                        durationField,
                        "Duration in days (1-"
                                + MAX_DURATION_DAYS
                                + ") is required for "
                                + type.name()
                                + ".");
            }
            return;
        }
        if (durationDays != null && (durationDays < 1 || durationDays > MAX_DURATION_DAYS)) {
            throw AppException.validation(
                    durationField,
                    "Duration in days must be between 1 and " + MAX_DURATION_DAYS + ".");
        }
    }
}
