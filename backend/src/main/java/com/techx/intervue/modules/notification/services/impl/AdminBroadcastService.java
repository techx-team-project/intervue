package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import com.techx.intervue.modules.notification.enums.NotificationKind;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.events.BroadcastDispatchRequestedEvent;
import com.techx.intervue.modules.notification.mappers.NotificationMapper;
import com.techx.intervue.modules.notification.policy.BroadcastStatusPolicy;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRepository;
import com.techx.intervue.modules.notification.requests.CreateBroadcastRequest;
import com.techx.intervue.modules.notification.requests.SearchBroadcastRequest;
import com.techx.intervue.modules.notification.requests.UpdateBroadcastRequest;
import com.techx.intervue.modules.notification.resources.AdminBroadcastResource;
import com.techx.intervue.modules.notification.resources.AudiencePreviewResource;
import com.techx.intervue.modules.notification.services.interfaces.AdminBroadcastServiceInterface;
import com.techx.intervue.modules.notification.specifications.NotificationSpecifications;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminBroadcastService implements AdminBroadcastServiceInterface {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final Sort TIE_BREAKER = Sort.by(Sort.Direction.DESC, "id");
    private static final int DISPATCH_BATCH_SIZE = 20;

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final NotificationMapper notificationMapper;
    private final BroadcastStatusPolicy statusPolicy;
    private final ApplicationEventPublisher eventPublisher;
    private final BroadcastWriter broadcastWriter;
    private final UserServiceInterface userService;
    private final RecruiterServiceInterface recruiterService;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminBroadcastResource> search(SearchBroadcastRequest request, Pageable pageable) {
        return notificationRepository
                .findAll(NotificationSpecifications.broadcasts(request), withStableOrder(pageable))
                .map(this::toResource);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBroadcastResource getById(Long id) {
        return toResource(require(id));
    }

    @Override
    @Transactional
    public AdminBroadcastResource create(CreateBroadcastRequest request, RequestActor actor) {
        Notification broadcast =
                notificationRepository.save(
                        Notification.builder()
                                .kind(NotificationKind.BROADCAST)
                                .type(NotificationType.ANNOUNCEMENT)
                                .audience(request.audience())
                                .category(NotificationType.ANNOUNCEMENT.getCategory())
                                .severity(request.severity())
                                .title(request.title())
                                .summary(request.summary())
                                .bodyMarkdown(request.bodyMarkdown())
                                .actionUrl(request.actionUrl())
                                .actionLabel(request.actionLabel())
                                .status(
                                        request.scheduledAt() == null
                                                ? BroadcastStatus.DRAFT
                                                : BroadcastStatus.SCHEDULED)
                                .scheduledAt(request.scheduledAt())
                                .createdByAdminId(actor.userId())
                                .build());

        audit(actor, AuditAction.BROADCAST_CREATED, broadcast);
        return toResource(broadcast);
    }

    @Override
    @Transactional
    public AdminBroadcastResource update(
            Long id, UpdateBroadcastRequest request, RequestActor actor) {
        Notification broadcast = requireEditable(id);

        broadcast.setAudience(request.audience());
        broadcast.setSeverity(request.severity());
        broadcast.setTitle(request.title());
        broadcast.setSummary(request.summary());
        broadcast.setBodyMarkdown(request.bodyMarkdown());
        broadcast.setActionUrl(request.actionUrl());
        broadcast.setActionLabel(request.actionLabel());
        broadcast.setScheduledAt(request.scheduledAt());
        broadcast.setStatus(
                request.scheduledAt() == null ? BroadcastStatus.DRAFT : BroadcastStatus.SCHEDULED);

        audit(actor, AuditAction.BROADCAST_UPDATED, broadcast);
        return toResource(broadcast);
    }

    @Override
    @Transactional
    public void delete(Long id, RequestActor actor) {
        Notification broadcast = require(id);
        if (broadcast.getStatus() != BroadcastStatus.DRAFT) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        audit(actor, AuditAction.BROADCAST_DELETED, broadcast);
        notificationRepository.delete(broadcast);
    }

    @Override
    @Transactional(readOnly = true)
    public AudiencePreviewResource previewAudience(Long id) {
        Notification broadcast = require(id);
        BroadcastAudience audience = broadcast.getAudience();
        List<Long> deliverable =
                broadcastWriter.withoutOptedOut(
                        audience.recipientType(), resolveAudience(audience));
        return new AudiencePreviewResource(audience, deliverable.size());
    }

    @Override
    @Transactional
    public AdminBroadcastResource send(Long id, RequestActor actor) {
        Notification broadcast = require(id);
        statusPolicy.requireTransition(broadcast.getStatus(), BroadcastStatus.SENDING);

        List<Long> recipientIds = resolveAudience(broadcast.getAudience());
        if (recipientIds.isEmpty()) {
            throw new AppException(ErrorCode.BROADCAST_AUDIENCE_EMPTY);
        }

        broadcast.setStatus(BroadcastStatus.SENDING);
        notificationRepository.save(broadcast);

        audit(actor, AuditAction.BROADCAST_SENT, broadcast);
        eventPublisher.publishEvent(
                new BroadcastDispatchRequestedEvent(
                        broadcast.getId(), broadcast.getAudience(), recipientIds));
        return toResource(broadcast);
    }

    @Override
    @Transactional
    public AdminBroadcastResource cancel(Long id, RequestActor actor) {
        Notification broadcast = require(id);
        statusPolicy.requireTransition(broadcast.getStatus(), BroadcastStatus.CANCELLED);

        broadcast.setStatus(BroadcastStatus.CANCELLED);
        audit(actor, AuditAction.BROADCAST_CANCELLED, broadcast);
        return toResource(broadcast);
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 * * * * *")
    public int dispatchDueBroadcasts() {
        List<Notification> due =
                notificationRepository.findByKindAndStatusAndScheduledAtLessThanEqual(
                        NotificationKind.BROADCAST, BroadcastStatus.SCHEDULED, Instant.now());
        int dispatched = 0;
        for (Notification broadcast : due.stream().limit(DISPATCH_BATCH_SIZE).toList()) {
            List<Long> recipientIds = resolveAudience(broadcast.getAudience());
            if (recipientIds.isEmpty()) {
                log.warn("Scheduled broadcast {} has no audience, cancelling", broadcast.getId());
                broadcast.setStatus(BroadcastStatus.CANCELLED);
                continue;
            }
            broadcast.setStatus(BroadcastStatus.SENDING);
            notificationRepository.save(broadcast);
            eventPublisher.publishEvent(
                    new BroadcastDispatchRequestedEvent(
                            broadcast.getId(), broadcast.getAudience(), recipientIds));
            dispatched++;
        }
        return dispatched;
    }

    private List<Long> resolveAudience(BroadcastAudience audience) {
        return switch (audience) {
            case CANDIDATE -> userService.findActiveIdsByRole(RoleType.CANDIDATE);
            case ADMIN -> userService.findActiveIdsByRole(RoleType.ADMIN);
            case RECRUITER -> recruiterService.findActiveIds();
        };
    }

    private Notification require(Long id) {
        Notification broadcast =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (broadcast.getKind() != NotificationKind.BROADCAST) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return broadcast;
    }

    private Notification requireEditable(Long id) {
        Notification broadcast = require(id);
        if (!statusPolicy.isEditable(broadcast.getStatus())) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        return broadcast;
    }

    private void audit(RequestActor actor, AuditAction action, Notification broadcast) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.NOTIFICATION_BROADCAST)
                        .targetId(broadcast.getId())
                        .detail(broadcast.getAudience() + ": " + broadcast.getTitle())
                        .ip(actor.ip())
                        .build());
    }

    private AdminBroadcastResource toResource(Notification broadcast) {
        long delivered =
                broadcast.getId() == null
                        ? 0
                        : recipientRepository.countByNotificationId(broadcast.getId());
        return notificationMapper.toBroadcastResource(broadcast, delivered);
    }

    private Pageable withStableOrder(Pageable pageable) {
        Sort requested = pageable.getSort().isSorted() ? pageable.getSort() : DEFAULT_SORT;
        return PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), requested.and(TIE_BREAKER));
    }
}
