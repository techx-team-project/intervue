package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.config.SepayProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.enums.SupportedBank;
import com.techx.intervue.modules.billing.repositories.BillingSettingsRepository;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingSettingsService implements BillingSettingsServiceInterface {

    private static final String ACCOUNT_NUMBER_PATTERN = "^[A-Za-z0-9]{4,30}$";

    private final BillingSettingsRepository settingsRepository;
    private final SepayProperties sepayProperties;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDefaultBankFromEnvironment() {
        SepayProperties.DefaultBank defaultBank = sepayProperties.defaultBank();
        if (defaultBank == null
                || isBlank(defaultBank.code())
                || isBlank(defaultBank.accountNumber())) {
            return;
        }
        String cleanAccount = defaultBank.accountNumber().replaceAll("\\s+", "");
        if (!cleanAccount.matches(ACCOUNT_NUMBER_PATTERN)) {
            log.warn("Ignored SEPAY_BANK_ACCOUNT because format is invalid");
            return;
        }
        SupportedBank bank = SupportedBank.byCode(defaultBank.code()).orElse(null);
        if (bank == null) {
            log.warn(
                    "Ignored SEPAY_BANK_CODE '{}' because it is not supported by SePay",
                    defaultBank.code());
            return;
        }
        settingsRepository
                .findFirstByOrderByIdAsc()
                .ifPresent(
                        settings -> {
                            if (isBlank(settings.getBankCode())
                                    && isBlank(settings.getBankAccountNumber())) {
                                settings.setBankCode(bank.getCode());
                                settings.setBankAccountNumber(cleanAccount);
                                if (!isBlank(defaultBank.accountName())) {
                                    String cleanName = defaultBank.accountName().trim();
                                    settings.setBankAccountName(
                                            cleanName.length() > 150
                                                    ? cleanName.substring(0, 150)
                                                    : cleanName);
                                }
                                if (!isBlank(sepayProperties.apiToken())) {
                                    settings.setPaymentSyncEnabled(true);
                                    if (settings.getPaymentSyncSince() == null) {
                                        settings.setPaymentSyncSince(Instant.now());
                                    }
                                }
                                log.info(
                                        "Initialized empty billing bank settings from environment ({})",
                                        bank.getCode());
                            }
                        });
    }

    @Override
    @Transactional(readOnly = true)
    public BillingSettings current() {
        return settingsRepository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() -> new AppException(ErrorCode.BILLING_NOT_CONFIGURED));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
