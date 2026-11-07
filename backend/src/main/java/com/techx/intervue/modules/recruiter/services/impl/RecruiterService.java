package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.enums.RecruiterStatus;
import com.techx.intervue.modules.recruiter.mappers.RecruiterMapper;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRefreshTokenRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterSocialAccountRepository;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecruiterService implements RecruiterServiceInterface {

    private static final int SWEEP_BATCH_SIZE = 200;
    private static final String DELETION_REQUESTED_REASON = "DELETION_REQUESTED";
    private static final String ACCOUNT_PURGED_REASON = "ACCOUNT_PURGED";

    private final RecruiterRepository recruiterRepository;
    private final RecruiterRefreshTokenRepository refreshTokenRepository;
    private final RecruiterSocialAccountRepository socialAccountRepository;
    private final RecruiterSessionCacheInterface sessionCache;
    private final RecruiterMapper recruiterMapper;

    @Override
    @Transactional(readOnly = true)
    public RecruiterResource getMe(Long recruiterId) {
        return recruiterRepository
                .findById(recruiterId)
                .map(recruiterMapper::toResource)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }

    @Override
    @Transactional
    public void requestAccountDeletion(Long recruiterId) {
        Recruiter recruiter = requireRecruiter(recruiterId);
        if (recruiter.getStatus() == RecruiterStatus.DELETED) {
            throw new AppException(ErrorCode.ACCOUNT_DELETED);
        }
        if (recruiter.getStatus() == RecruiterStatus.SUSPENDED) {
            throw new AppException(ErrorCode.ACCOUNT_BANNED);
        }
        if (recruiter.getStatus() == RecruiterStatus.PENDING_DELETION) {
            return;
        }

        Instant now = Instant.now();
        recruiter.setStatus(RecruiterStatus.PENDING_DELETION);
        recruiter.setDeleteRequestedAt(now);
        recruiterRepository.save(recruiter);

        refreshTokenRepository.revokeAllByRecruiterId(recruiterId, now, DELETION_REQUESTED_REASON);
        sessionCache.evict(recruiterId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecruiterResource> findByIds(Collection<Long> recruiterIds) {
        if (recruiterIds == null || recruiterIds.isEmpty()) {
            return List.of();
        }
        return recruiterRepository.findAllById(recruiterIds).stream()
                .map(recruiterMapper::toResource)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> findActiveIds() {
        return recruiterRepository.findIdsByStatus(RecruiterStatus.ACTIVE);
    }

    @Override
    @Transactional
    public RecruiterResource cancelAccountDeletion(Long recruiterId) {
        Recruiter recruiter = requireRecruiter(recruiterId);
        if (recruiter.getStatus() != RecruiterStatus.PENDING_DELETION) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_PENDING_DELETION);
        }

        recruiter.setStatus(RecruiterStatus.ACTIVE);
        recruiter.setDeleteRequestedAt(null);
        return recruiterMapper.toResource(recruiterRepository.save(recruiter));
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 2 * * *")
    public int purgeExpiredPendingDeletions() {
        Instant cutoff = Instant.now().minus(7, ChronoUnit.DAYS);
        List<Recruiter> expired =
                recruiterRepository.findPendingDeletionsExpired(
                        RecruiterStatus.PENDING_DELETION,
                        cutoff,
                        PageRequest.of(0, SWEEP_BATCH_SIZE));
        if (expired.isEmpty()) {
            return 0;
        }

        Instant now = Instant.now();
        for (Recruiter recruiter : expired) {
            recruiter.setStatus(RecruiterStatus.DELETED);
            recruiter.setDeletedAt(now);
            recruiter.setName("Deleted Recruiter");
            recruiter.setEmail(
                    "deleted_recruiter_"
                            + recruiter.getId()
                            + "_"
                            + System.currentTimeMillis()
                            + "@deleted.local");
            recruiter.setPhone(null);
            recruiter.setPhoneVerifiedAt(null);
            recruiter.setImage(null);
            recruiter.setPassword("$disabled$" + UUID.randomUUID());
            recruiterRepository.save(recruiter);

            refreshTokenRepository.revokeAllByRecruiterId(
                    recruiter.getId(), now, ACCOUNT_PURGED_REASON);
            socialAccountRepository.deleteByRecruiterId(recruiter.getId());
            sessionCache.evict(recruiter.getId());
        }
        log.info("Purged {} expired pending-deletion recruiter accounts", expired.size());
        return expired.size();
    }

    private Recruiter requireRecruiter(Long recruiterId) {
        return recruiterRepository
                .findById(recruiterId)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
