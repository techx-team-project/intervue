package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.CryptoUtil;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.helpers.TotpUtil;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.entities.RecruiterTwoFactor;
import com.techx.intervue.modules.recruiter.entities.RecruiterTwoFactorRecoveryCode;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterTwoFactorRecoveryCodeRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterTwoFactorRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterTwoFactorServiceInterface;
import com.techx.intervue.modules.user.enums.TwoFactorMethod;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecruiterTwoFactorService implements RecruiterTwoFactorServiceInterface {

    private static final String APP_NAME = "InterVue Recruiter";
    private static final int BACKUP_CODES_COUNT = 8;

    private final RecruiterTwoFactorRepository recruiterTwoFactorRepository;
    private final RecruiterTwoFactorRecoveryCodeRepository recoveryCodeRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthConfig authConfig;

    @Override
    @Transactional
    public TwoFactorSetupResource setup(Long recruiterId, String email) {
        String secret = TotpUtil.generateSecretKey();
        String encryptedSecret = CryptoUtil.encrypt(secret, authConfig.getSecretKey());

        RecruiterTwoFactor entity =
                recruiterTwoFactorRepository
                        .findById(recruiterId)
                        .orElseGet(
                                () ->
                                        RecruiterTwoFactor.builder()
                                                .recruiterId(recruiterId)
                                                .build());
        entity.setMethod(TwoFactorMethod.TOTP);
        entity.setSecret(encryptedSecret);
        entity.setConfirmedAt(null);
        recruiterTwoFactorRepository.save(entity);

        recoveryCodeRepository.deleteAllByRecruiterId(recruiterId);
        List<String> rawBackupCodes = TotpUtil.generateBackupCodes(BACKUP_CODES_COUNT);
        for (String rawCode : rawBackupCodes) {
            String clean = rawCode.replaceAll("\\s+|-", "");
            recoveryCodeRepository.save(
                    RecruiterTwoFactorRecoveryCode.builder()
                            .recruiterId(recruiterId)
                            .codeHash(TokenHashUtil.sha256(clean))
                            .build());
        }

        String totpUri = TotpUtil.getTotpUri(secret, email, APP_NAME);
        String qrCodeDataUrl = TotpUtil.generateQrCodeDataUrl(totpUri, 200, 200);

        return new TwoFactorSetupResource(secret, totpUri, qrCodeDataUrl, rawBackupCodes);
    }

    @Override
    @Transactional(readOnly = true)
    public TwoFactorStatusResource getStatus(Long recruiterId) {
        return recruiterTwoFactorRepository
                .findById(recruiterId)
                .map(
                        tf -> {
                            boolean enabled = tf.isConfirmed();
                            int unspent =
                                    enabled
                                            ? recoveryCodeRepository
                                                    .findByRecruiterIdAndUsedAtIsNull(recruiterId)
                                                    .size()
                                            : 0;
                            return new TwoFactorStatusResource(
                                    enabled, tf.getConfirmedAt(), unspent);
                        })
                .orElseGet(() -> new TwoFactorStatusResource(false, null, 0));
    }

    @Override
    @Transactional
    public TwoFactorStatusResource confirm(Long recruiterId, String code) {
        RecruiterTwoFactor entity =
                recruiterTwoFactorRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        String plainSecret = CryptoUtil.decrypt(entity.getSecret(), authConfig.getSecretKey());
        if (!TotpUtil.validateCode(plainSecret, code)) {
            throw AppException.validation(
                    "code", "Invalid verification code. Please check your authenticator app.");
        }

        entity.setConfirmedAt(Instant.now());
        recruiterTwoFactorRepository.save(entity);

        int unspent = recoveryCodeRepository.findByRecruiterIdAndUsedAtIsNull(recruiterId).size();
        return new TwoFactorStatusResource(true, entity.getConfirmedAt(), unspent);
    }

    @Override
    @Transactional
    public void disable(Long recruiterId, String password) {
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (password != null && !passwordEncoder.matches(password, recruiter.getPassword())) {
            throw AppException.validation("password", "Password is incorrect.");
        }

        recoveryCodeRepository.deleteAllByRecruiterId(recruiterId);
        recruiterTwoFactorRepository.deleteById(recruiterId);
    }

    @Override
    @Transactional
    public boolean verifyCodeOrRecoveryCode(Long recruiterId, String code) {
        if (code == null || code.isBlank()) return false;
        RecruiterTwoFactor entity = recruiterTwoFactorRepository.findById(recruiterId).orElse(null);
        if (entity == null || !entity.isConfirmed()) return false;

        String plainSecret = CryptoUtil.decrypt(entity.getSecret(), authConfig.getSecretKey());
        if (TotpUtil.validateCode(plainSecret, code)) {
            return true;
        }

        String cleanCode = code.replaceAll("\\s+|-", "");
        String codeHash = TokenHashUtil.sha256(cleanCode);
        List<RecruiterTwoFactorRecoveryCode> codes =
                recoveryCodeRepository.findByRecruiterIdAndUsedAtIsNull(recruiterId);
        for (RecruiterTwoFactorRecoveryCode recoveryCode : codes) {
            if (recoveryCode.getCodeHash().equals(codeHash)) {
                recoveryCode.setUsedAt(Instant.now());
                recoveryCodeRepository.save(recoveryCode);
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTwoFactorEnabled(Long recruiterId) {
        return recruiterTwoFactorRepository
                .findById(recruiterId)
                .map(RecruiterTwoFactor::isConfirmed)
                .orElse(false);
    }
}
