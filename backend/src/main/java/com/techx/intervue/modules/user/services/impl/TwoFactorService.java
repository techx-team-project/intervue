package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.CryptoUtil;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.helpers.TotpUtil;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserTwoFactor;
import com.techx.intervue.modules.user.entities.UserTwoFactorRecoveryCode;
import com.techx.intervue.modules.user.enums.TwoFactorMethod;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.repositories.UserTwoFactorRecoveryCodeRepository;
import com.techx.intervue.modules.user.repositories.UserTwoFactorRepository;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import com.techx.intervue.modules.user.services.interfaces.TwoFactorServiceInterface;
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
public class TwoFactorService implements TwoFactorServiceInterface {

    private static final String APP_NAME = "InterVue";
    private static final int BACKUP_CODES_COUNT = 8;

    private final UserTwoFactorRepository userTwoFactorRepository;
    private final UserTwoFactorRecoveryCodeRepository recoveryCodeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthConfig authConfig;

    @Override
    @Transactional
    public TwoFactorSetupResource setup(Long userId, String email) {
        String secret = TotpUtil.generateSecretKey();
        String encryptedSecret = CryptoUtil.encrypt(secret, authConfig.getSecretKey());

        UserTwoFactor entity =
                userTwoFactorRepository
                        .findById(userId)
                        .orElseGet(() -> UserTwoFactor.builder().userId(userId).build());
        entity.setMethod(TwoFactorMethod.TOTP);
        entity.setSecret(encryptedSecret);
        entity.setConfirmedAt(null);
        userTwoFactorRepository.save(entity);

        recoveryCodeRepository.deleteByUserId(userId);
        List<String> rawBackupCodes = TotpUtil.generateBackupCodes(BACKUP_CODES_COUNT);
        for (String rawCode : rawBackupCodes) {
            String clean = rawCode.replaceAll("\\s+|-", "");
            recoveryCodeRepository.save(
                    UserTwoFactorRecoveryCode.builder()
                            .userId(userId)
                            .codeHash(TokenHashUtil.sha256(clean))
                            .build());
        }

        String totpUri = TotpUtil.getTotpUri(secret, email, APP_NAME);
        String qrCodeDataUrl = TotpUtil.generateQrCodeDataUrl(totpUri, 200, 200);

        return new TwoFactorSetupResource(secret, totpUri, qrCodeDataUrl, rawBackupCodes);
    }

    @Override
    @Transactional(readOnly = true)
    public TwoFactorStatusResource getStatus(Long userId) {
        return userTwoFactorRepository
                .findById(userId)
                .map(
                        tf -> {
                            boolean enabled = tf.isConfirmed();
                            int unspent =
                                    enabled
                                            ? (int)
                                                    recoveryCodeRepository
                                                            .findByUserId(userId)
                                                            .stream()
                                                            .filter(c -> !c.isUsed())
                                                            .count()
                                            : 0;
                            return new TwoFactorStatusResource(
                                    enabled, tf.getConfirmedAt(), unspent);
                        })
                .orElseGet(() -> new TwoFactorStatusResource(false, null, 0));
    }

    @Override
    @Transactional
    public TwoFactorStatusResource confirm(Long userId, String code) {
        UserTwoFactor entity =
                userTwoFactorRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        String plainSecret = CryptoUtil.decrypt(entity.getSecret(), authConfig.getSecretKey());
        if (!TotpUtil.validateCode(plainSecret, code)) {
            throw AppException.validation(
                    "code", "Invalid verification code. Please check your authenticator app.");
        }

        entity.setConfirmedAt(Instant.now());
        userTwoFactorRepository.save(entity);

        int unspent =
                (int)
                        recoveryCodeRepository.findByUserId(userId).stream()
                                .filter(c -> !c.isUsed())
                                .count();

        return new TwoFactorStatusResource(true, entity.getConfirmedAt(), unspent);
    }

    @Override
    @Transactional
    public void disable(Long userId, String password) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (password != null && !passwordEncoder.matches(password, user.getPassword())) {
            throw AppException.validation("password", "Password is incorrect.");
        }

        recoveryCodeRepository.deleteByUserId(userId);
        userTwoFactorRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public boolean verifyCodeOrRecoveryCode(Long userId, String code) {
        if (code == null || code.isBlank()) return false;
        UserTwoFactor entity = userTwoFactorRepository.findById(userId).orElse(null);
        if (entity == null || !entity.isConfirmed()) return false;

        String plainSecret = CryptoUtil.decrypt(entity.getSecret(), authConfig.getSecretKey());
        if (TotpUtil.validateCode(plainSecret, code)) {
            return true;
        }

        String cleanCode = code.replaceAll("\\s+|-", "");
        String codeHash = TokenHashUtil.sha256(cleanCode);
        List<UserTwoFactorRecoveryCode> codes = recoveryCodeRepository.findByUserId(userId);
        for (UserTwoFactorRecoveryCode recoveryCode : codes) {
            if (!recoveryCode.isUsed() && recoveryCode.getCodeHash().equals(codeHash)) {
                recoveryCode.setUsedAt(Instant.now());
                recoveryCodeRepository.save(recoveryCode);
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTwoFactorEnabled(Long userId) {
        return userTwoFactorRepository
                .findById(userId)
                .map(UserTwoFactor::isConfirmed)
                .orElse(false);
    }

    @Override
    @Transactional
    public List<String> regenerateRecoveryCodes(Long userId) {
        recoveryCodeRepository.deleteByUserId(userId);
        List<String> rawBackupCodes = TotpUtil.generateBackupCodes(BACKUP_CODES_COUNT);
        for (String rawCode : rawBackupCodes) {
            String clean = rawCode.replaceAll("\\s+|-", "");
            recoveryCodeRepository.save(
                    UserTwoFactorRecoveryCode.builder()
                            .userId(userId)
                            .codeHash(TokenHashUtil.sha256(clean))
                            .build());
        }
        return rawBackupCodes;
    }
}
