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
                    EntitlementType.JOB_BOOST,
                    EntitlementType.JOB_LABEL_URGENT,
                    EntitlementType.JOB_LABEL_HOT,
                    EntitlementType.JOB_HIGHLIGHT,
                    EntitlementType.BRAND_PAGE,
                    EntitlementType.FEATURED_COMPANY,
                    EntitlementType.AD_SLOT_WEEK);

    private EntitlementConfigRules() {}

    static void validateBenefit(
            int index, EntitlementType type, Integer tier, Integer durationDays) {
        String prefix = "benefits[" + index + "].";
        validateCommon(prefix + "tier", prefix + "durationDays", type, tier, durationDays);
    }

    private static void validateCommon(
            String tierField,
            String durationField,
            EntitlementType type,
            Integer tier,
            Integer durationDays) {
        if (type == null) {
            return;
        }
        if (tier == null || tier < 1 || tier > 3) {
            throw AppException.validation(tierField, "Tier must be between 1 and 3.");
        }
        if (type != EntitlementType.JOB_BOOST && tier != 1) {
            throw AppException.validation(
                    tierField,
                    "Only JOB_BOOST supports boost tiers 1-3; "
                            + type.name()
                            + " must use tier 1.");
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
