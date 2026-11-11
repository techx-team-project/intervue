package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.services.interfaces.AdPackageLookupPortInterface;
import com.techx.intervue.modules.billing.entities.ServiceCategory;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.ServicePackageBenefit;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.repositories.ServiceCategoryRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageBenefitRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AdPackageLookupAdapter implements AdPackageLookupPortInterface {

    private final ServicePackageRepository packageRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServicePackageBenefitRepository benefitRepository;
    private final AdSlotRepository slotRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean isAdPackage(Long servicePackageId) {
        return servicePackageId != null
                && slotRepository.findByServicePackageId(servicePackageId).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> slugOf(Long servicePackageId) {
        return servicePackageId == null
                ? Optional.empty()
                : packageRepository.findById(servicePackageId).map(ServicePackage::getSlug);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsPackage(Long servicePackageId) {
        return servicePackageId != null && packageRepository.existsById(servicePackageId);
    }

    @Override
    @Transactional
    public void syncPrice(Long servicePackageId, Long price) {
        if (servicePackageId == null || price == null) {
            return;
        }
        packageRepository
                .findById(servicePackageId)
                .ifPresent(servicePackage -> servicePackage.setPrice(price));
    }

    @Override
    @Transactional
    public Long createBannerPackageForSlot(
            String slotCode,
            String slotName,
            String description,
            Long pricePerWeek,
            Integer displayOrder) {
        ServiceCategory bannerCategory =
                categoryRepository
                        .findByCode("BANNER")
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        String rawCode = slotCode.startsWith("BANNER_") ? slotCode : "BANNER_" + slotCode;
        String packageCode = rawCode.length() > 50 ? rawCode.substring(0, 50) : rawCode;
        String slug = packageCode.toLowerCase(Locale.ROOT).replace('_', '-');
        if (packageRepository.existsByCode(packageCode) || packageRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.DUPLICATE_PACKAGE_CODE);
        }

        ServicePackage saved =
                packageRepository.save(
                        ServicePackage.builder()
                                .category(bannerCategory)
                                .code(packageCode)
                                .slug(slug)
                                .name("BANNER " + slotName.trim().toUpperCase(Locale.ROOT))
                                .shortDescription(
                                        description != null && !description.isBlank()
                                                ? description.trim()
                                                : "Vị trí banner "
                                                        + slotName.trim()
                                                        + " bán theo tuần.")
                                .price(pricePerWeek)
                                .accentColor("#16a34a")
                                .status(ServicePackageStatus.ACTIVE)
                                .displayOrder(displayOrder == null ? 0 : displayOrder)
                                .build());

        benefitRepository.save(
                ServicePackageBenefit.builder()
                        .servicePackage(saved)
                        .entitlementType(EntitlementType.AD_SLOT_WEEK)
                        .quantity(1)
                        .tier(1)
                        .durationDays(7)
                        .label("01 tuần hiển thị banner " + slotName.trim())
                        .displayOrder(0)
                        .build());

        return saved.getId();
    }
}
