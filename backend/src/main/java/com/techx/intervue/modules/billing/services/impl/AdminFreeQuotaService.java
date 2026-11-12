package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.common.policy.FreeQuotaValues;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.config.AiProperties;
import com.techx.intervue.config.BillingProperties;
import com.techx.intervue.modules.billing.entities.FreeQuotaSettings;
import com.techx.intervue.modules.billing.repositories.FreeQuotaSettingsRepository;
import com.techx.intervue.modules.billing.requests.SaveFreeQuotaSettingsRequest;
import com.techx.intervue.modules.billing.resources.FreeQuotaSettingsResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminFreeQuotaServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminFreeQuotaService
        implements AdminFreeQuotaServiceInterface, FreeQuotaPolicyInterface {

    private final FreeQuotaSettingsRepository settingsRepository;
    private final AuditLogServiceInterface auditLogService;
    private final AiProperties aiProperties;
    private final BillingProperties billingProperties;

    @Override
    @Transactional(readOnly = true)
    public FreeQuotaValues current() {
        return settingsRepository
                .findFirstByOrderByIdAsc()
                .map(AdminFreeQuotaService::toValues)
                .orElseGet(this::fallbackValues);
    }

    @Override
    @Transactional(readOnly = true)
    public FreeQuotaSettingsResource getSettings() {
        return settingsRepository
                .findFirstByOrderByIdAsc()
                .map(AdminFreeQuotaService::toResource)
                .orElseGet(() -> toResource(fallbackValues()));
    }

    @Override
    @Transactional
    public FreeQuotaSettingsResource updateSettings(
            SaveFreeQuotaSettingsRequest request, RequestActor actor) {
        FreeQuotaSettings settings =
                settingsRepository
                        .findFirstByOrderByIdAsc()
                        .orElseGet(() -> settingsRepository.save(new FreeQuotaSettings()));
        settings.setAiResumeMatchFreePerMonth(request.aiResumeMatchFreePerMonth());
        settings.setAiJdGenerateFreePerMonth(request.aiJdGenerateFreePerMonth());
        settings.setCvReviewFreePerDay(request.cvReviewFreePerDay());
        settings.setCandidateStarterCredits(request.candidateStarterCredits());
        settings.setConnectDailyInviteLimit(request.connectDailyInviteLimit());
        settings.setCompanyFreePhotoLimit(request.companyFreePhotoLimit());
        settings.setRequireJobSlot(Boolean.TRUE.equals(request.requireJobSlot()));
        settings.setJobFreeActiveLimit(request.jobFreeActiveLimit());
        settings.setJobFreeMaxDays(request.jobFreeMaxDays());
        FreeQuotaSettings saved = settingsRepository.save(settings);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(AuditAction.FREE_QUOTA_SETTINGS_UPDATED)
                        .targetType(AuditTargetType.FREE_QUOTA_SETTINGS)
                        .targetId(saved.getId())
                        .detail(
                                "match=%d, jd=%d, cv=%d, credits=%d, connect=%d, photos=%d, requireJobSlot=%s, jobFreeActive=%d, jobFreeDays=%d"
                                        .formatted(
                                                saved.getAiResumeMatchFreePerMonth(),
                                                saved.getAiJdGenerateFreePerMonth(),
                                                saved.getCvReviewFreePerDay(),
                                                saved.getCandidateStarterCredits(),
                                                saved.getConnectDailyInviteLimit(),
                                                saved.getCompanyFreePhotoLimit(),
                                                saved.isRequireJobSlot(),
                                                saved.getJobFreeActiveLimit(),
                                                saved.getJobFreeMaxDays()))
                        .ip(actor.ip())
                        .build());

        return toResource(saved);
    }

    private FreeQuotaValues fallbackValues() {
        FreeQuotaValues defaults = FreeQuotaValues.DEFAULTS;
        int matchLimit =
                aiProperties.quota() != null
                        ? aiProperties.quota().resumeMatchFreePerMonth()
                        : defaults.aiResumeMatchFreePerMonth();
        int jdLimit =
                aiProperties.quota() != null
                        ? aiProperties.quota().jdGenerateFreePerMonth()
                        : defaults.aiJdGenerateFreePerMonth();
        return new FreeQuotaValues(
                matchLimit,
                jdLimit,
                defaults.cvReviewFreePerDay(),
                defaults.candidateStarterCredits(),
                defaults.connectDailyInviteLimit(),
                defaults.companyFreePhotoLimit(),
                billingProperties.requiresJobSlot(),
                defaults.jobFreeActiveLimit(),
                defaults.jobFreeMaxDays());
    }

    private static FreeQuotaValues toValues(FreeQuotaSettings s) {
        return new FreeQuotaValues(
                s.getAiResumeMatchFreePerMonth(),
                s.getAiJdGenerateFreePerMonth(),
                s.getCvReviewFreePerDay(),
                s.getCandidateStarterCredits(),
                s.getConnectDailyInviteLimit(),
                s.getCompanyFreePhotoLimit(),
                s.isRequireJobSlot(),
                s.getJobFreeActiveLimit(),
                s.getJobFreeMaxDays());
    }

    private static FreeQuotaSettingsResource toResource(FreeQuotaSettings s) {
        return FreeQuotaSettingsResource.builder()
                .aiResumeMatchFreePerMonth(s.getAiResumeMatchFreePerMonth())
                .aiJdGenerateFreePerMonth(s.getAiJdGenerateFreePerMonth())
                .cvReviewFreePerDay(s.getCvReviewFreePerDay())
                .candidateStarterCredits(s.getCandidateStarterCredits())
                .connectDailyInviteLimit(s.getConnectDailyInviteLimit())
                .companyFreePhotoLimit(s.getCompanyFreePhotoLimit())
                .requireJobSlot(s.isRequireJobSlot())
                .jobFreeActiveLimit(s.getJobFreeActiveLimit())
                .jobFreeMaxDays(s.getJobFreeMaxDays())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private static FreeQuotaSettingsResource toResource(FreeQuotaValues values) {
        return FreeQuotaSettingsResource.builder()
                .aiResumeMatchFreePerMonth(values.aiResumeMatchFreePerMonth())
                .aiJdGenerateFreePerMonth(values.aiJdGenerateFreePerMonth())
                .cvReviewFreePerDay(values.cvReviewFreePerDay())
                .candidateStarterCredits(values.candidateStarterCredits())
                .connectDailyInviteLimit(values.connectDailyInviteLimit())
                .companyFreePhotoLimit(values.companyFreePhotoLimit())
                .requireJobSlot(values.requireJobSlot())
                .jobFreeActiveLimit(values.jobFreeActiveLimit())
                .jobFreeMaxDays(values.jobFreeMaxDays())
                .build();
    }
}
