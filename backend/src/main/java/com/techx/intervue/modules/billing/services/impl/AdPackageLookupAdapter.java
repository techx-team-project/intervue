package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.services.interfaces.AdPackageLookupPortInterface;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AdPackageLookupAdapter implements AdPackageLookupPortInterface {

    private final ServicePackageRepository packageRepository;
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
}
