package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.LocalRecruiterSeedServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("local")
@RequiredArgsConstructor
public class LocalRecruiterSeedService implements LocalRecruiterSeedServiceInterface {

    private static final String DEMO_PHONE_FORMAT = "09%08d";

    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void markContactVerified(Long recruiterId) {
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Instant now = Instant.now();
        if (recruiter.getEmailVerifiedAt() == null) {
            recruiter.setEmailVerifiedAt(now);
        }
        if (recruiter.getPhoneVerifiedAt() == null) {
            if (recruiter.getPhone() == null) {
                recruiter.setPhone(String.format(DEMO_PHONE_FORMAT, recruiterId));
            }
            recruiter.setPhoneVerifiedAt(now);
        }
        recruiterRepository.save(recruiter);
    }

    @Override
    @Transactional
    public boolean createIfAbsent(String name, String email, String rawPassword) {
        String normalizedEmail = EmailHelper.normalize(email);
        var existing = recruiterRepository.findByEmail(normalizedEmail);
        if (existing.isPresent()) {
            Recruiter recruiter = existing.get();
            recruiter.setPassword(passwordEncoder.encode(rawPassword));
            recruiterRepository.save(recruiter);
            return false;
        }

        Instant now = Instant.now();
        recruiterRepository.save(
                Recruiter.builder()
                        .name(name.trim())
                        .email(normalizedEmail)
                        .password(passwordEncoder.encode(rawPassword))
                        .emailVerifiedAt(now)
                        .termsAcceptedAt(now)
                        .build());
        return true;
    }
}
