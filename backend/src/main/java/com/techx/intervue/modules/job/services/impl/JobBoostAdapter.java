package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.entitlement.services.interfaces.JobBoostPortInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.function.Consumer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class JobBoostAdapter implements JobBoostPortInterface {

    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean isPublishedJobOfCompany(Long jobId, Long companyId) {
        return jobRepository
                .findById(jobId)
                .filter(job -> job.getCompanyId().equals(companyId))
                .filter(job -> job.getStatus() == JobStatus.PUBLISHED)
                .filter(
                        job ->
                                job.getDeadline() == null
                                        || !job.getDeadline().isBefore(JobDeadlines.today()))
                .isPresent();
    }

    @Override
    @Transactional
    public void applyBoost(Long jobId, int tier, Instant expiresAt) {
        apply(
                jobId,
                job -> {
                    job.setBoostLevel(Math.max(job.getBoostLevel(), tier));
                    job.setBoostExpiresAt(expiresAt);
                });
    }

    @Override
    @Transactional
    public void applyLabel(Long jobId, String label, Instant expiresAt) {
        apply(
                jobId,
                job -> {
                    job.setHighlightLabel(label);
                    job.setHighlightLabelExpiresAt(expiresAt);
                });
    }

    @Override
    @Transactional
    public void applyHighlight(Long jobId, Instant expiresAt) {
        apply(
                jobId,
                job -> {
                    job.setHighlighted(true);
                    job.setHighlightExpiresAt(expiresAt);
                });
    }

    @Override
    @Transactional
    public void applyRetop(Long jobId, Instant retoppedAt) {
        apply(jobId, job -> job.setRetoppedAt(retoppedAt));
    }

    @Override
    @Transactional
    public void clearExpiredBoost(Long jobId) {
        Instant now = Instant.now();
        apply(
                jobId,
                job -> {
                    if (job.getBoostExpiresAt() == null || !job.getBoostExpiresAt().isAfter(now)) {
                        job.setBoostLevel(0);
                        job.setBoostExpiresAt(null);
                    }
                });
    }

    @Override
    @Transactional
    public void clearExpiredLabel(Long jobId, String expectedLabel) {
        Instant now = Instant.now();
        apply(
                jobId,
                job -> {
                    boolean matchesLabel =
                            expectedLabel == null || expectedLabel.equals(job.getHighlightLabel());
                    boolean isExpired =
                            job.getHighlightLabelExpiresAt() == null
                                    || !job.getHighlightLabelExpiresAt().isAfter(now);
                    if (matchesLabel && isExpired) {
                        job.setHighlightLabel(null);
                        job.setHighlightLabelExpiresAt(null);
                    }
                });
    }

    @Override
    @Transactional
    public void clearExpiredHighlight(Long jobId) {
        Instant now = Instant.now();
        apply(
                jobId,
                job -> {
                    if (job.getHighlightExpiresAt() == null
                            || !job.getHighlightExpiresAt().isAfter(now)) {
                        job.setHighlighted(false);
                        job.setHighlightExpiresAt(null);
                    }
                });
    }

    private void apply(Long jobId, Consumer<Job> mutation) {
        Optional<Job> found = jobRepository.findById(jobId);
        if (found.isEmpty()) {
            return;
        }
        mutation.accept(found.get());
    }
}
