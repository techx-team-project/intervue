package com.techx.intervue.modules.ads.services.interfaces;

import java.util.Optional;

/** Declared here and implemented in billing, so ads never imports a peer module. */
public interface AdPackageLookupPortInterface {

    Optional<String> slugOf(Long servicePackageId);

    boolean isAdPackage(Long servicePackageId);

    boolean existsPackage(Long servicePackageId);

    void syncPrice(Long servicePackageId, Long price);

    Long createBannerPackageForSlot(
            String slotCode,
            String slotName,
            String description,
            Long pricePerWeek,
            Integer displayOrder);
}
