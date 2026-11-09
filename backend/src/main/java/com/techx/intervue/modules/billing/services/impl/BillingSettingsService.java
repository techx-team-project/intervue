package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.repositories.BillingSettingsRepository;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BillingSettingsService implements BillingSettingsServiceInterface {

    private final BillingSettingsRepository settingsRepository;

    @Override
    @Transactional(readOnly = true)
    public BillingSettings current() {
        return settingsRepository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() -> new AppException(ErrorCode.BILLING_NOT_CONFIGURED));
    }
}
