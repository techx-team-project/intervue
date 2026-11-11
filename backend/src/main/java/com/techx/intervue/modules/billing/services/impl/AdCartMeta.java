package com.techx.intervue.modules.billing.services.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.services.interfaces.AdPackageLookupPortInterface;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** Turns the weeks a buyer picked into the line metadata the ads module reads back at checkout. */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdCartMeta {

    public static final String WEEKS_KEY = "weeks";

    private final AdPackageLookupPortInterface packageLookup;
    private final ObjectMapper objectMapper;

    public String build(ServicePackage servicePackage, List<LocalDate> weeks, int quantity) {
        if (!packageLookup.isAdPackage(servicePackage.getId())) {
            return null;
        }
        if (weeks == null || weeks.isEmpty()) {
            throw new AppException(ErrorCode.AD_WEEKS_REQUIRED);
        }
        List<LocalDate> distinct = weeks.stream().distinct().sorted().toList();
        if (distinct.size() != quantity) {
            throw AppException.validation("quantity", "Quantity must match the number of weeks");
        }
        try {
            return objectMapper.writeValueAsString(Map.of(WEEKS_KEY, distinct));
        } catch (Exception cause) {
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    public boolean isAdPackage(Long servicePackageId) {
        return packageLookup.isAdPackage(servicePackageId);
    }

    public List<LocalDate> readWeeks(String metaJson) {
        if (metaJson == null || metaJson.isBlank()) {
            return List.of();
        }
        try {
            Map<String, List<LocalDate>> parsed =
                    objectMapper.readValue(metaJson, new TypeReference<>() {});
            return parsed.getOrDefault(WEEKS_KEY, List.of());
        } catch (Exception cause) {
            log.warn("Could not read ad weeks from line metadata", cause);
            return List.of();
        }
    }
}
