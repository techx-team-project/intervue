package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.common.storage.FileType;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectMessageType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import com.techx.intervue.modules.connect.mappers.ConnectMapper;
import com.techx.intervue.modules.connect.repositories.ConnectionMessageRepository;
import com.techx.intervue.modules.connect.repositories.ConnectionRepository;
import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.requests.SendMessageRequest;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.connect.services.interfaces.CandidateEligibilityPortInterface;
import com.techx.intervue.modules.connect.services.interfaces.CandidateEligibilityPortInterface.EligibleCandidate;
import com.techx.intervue.modules.connect.services.interfaces.ConnectModerationServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectQuotaServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectSseServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectUnreadServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface.LinkPreview;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ConnectionService implements ConnectionServiceInterface {

    private static final Sort NEWEST_FIRST = Sort.by("createdAt").descending();

    private final ConnectionRepository connectionRepository;
    private final ConnectionMessageRepository messageRepository;
    private final CandidateEligibilityPortInterface eligibilityPort;
    private final ConnectQuotaServiceInterface quotaService;
    private final ConnectCompanyScope companyScope;
    private final CompanyServiceInterface companyService;
    private final NotificationPublisherInterface notificationPublisher;
    private final ConnectModerationServiceInterface moderationService;
    private final LinkPreviewServiceInterface linkPreviewService;
    private final StorageServiceInterface storageService;
    private final ConnectSseServiceInterface sseService;
    private final ConnectUnreadServiceInterface unreadService;
    private final ReportServiceInterface reportService;
    private final ConnectMapper mapper;

    @Override
    @Transactional
    public InvitationResource invite(Long recruiterId, SendInvitationRequest request) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        if (connectionRepository.existsByCandidateIdAndCompanyId(
                request.candidateId(), companyId)) {
            throw new AppException(ErrorCode.CONNECTION_ALREADY_EXISTS);
        }
        EligibleCandidate candidate =
                eligibilityPort
                        .findCandidateSummary(request.candidateId(), companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_ELIGIBLE_TO_CONNECT));
        quotaService.reserve(recruiterId);
        CompanySummaryResource company = companyService.findSummary(companyId);

        Connection connection =
                connectionRepository.save(
                        Connection.builder()
                                .candidateId(candidate.candidateId())
                                .candidateName(candidate.fullName())
                                .candidateEmail(candidate.email())
                                .companyId(companyId)
                                .companyName(company.name())
                                .initiatedByRecruiterId(recruiterId)
                                .status(ConnectionStatus.PENDING)
                                .invitedAt(Instant.now())
                                .build());
        messageRepository.save(
                ConnectionMessage.builder()
                        .connectionId(connection.getId())
                        .senderType(ConnectActorType.RECRUITER)
                        .senderId(recruiterId)
                        .messageType(ConnectMessageType.TEXT)
                        .body(request.message())
                        .build());

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(candidate.candidateId())
                        .type(NotificationType.CONNECT_INVITATION_RECEIVED)
                        .params(Map.of("companyName", company.name()))
                        .actionUrl("/candidate/conversations")
                        .build());

        return mapper.toInvitation(connection, request.message());
    }

    @Override
    @Transactional
    public void accept(Long candidateId, Long connectionId) {
        Connection connection = requirePending(connectionId, candidateId);
        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setRespondedAt(Instant.now());

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(connection.getInitiatedByRecruiterId())
                        .type(NotificationType.CONNECT_INVITATION_ACCEPTED)
                        .params(Map.of("candidateName", connection.getCandidateName()))
                        .actionUrl("/recruiter/conversations")
                        .build());
    }

    @Override
    @Transactional
    public void decline(Long candidateId, Long connectionId) {
        Connection connection = requirePending(connectionId, candidateId);
        connection.setStatus(ConnectionStatus.DECLINED);
        connection.setRespondedAt(Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> candidateInvitations(
            Long candidateId, Pageable pageable) {
        return connectionRepository
                .findByCandidateIdAndStatus(candidateId, ConnectionStatus.PENDING, pageable)
                .map(mapper::toConversationSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> candidateConversations(
            Long candidateId, Pageable pageable) {
        return connectionRepository
                .findByCandidateIdAndStatus(candidateId, ConnectionStatus.ACCEPTED, pageable)
                .map(mapper::toConversationSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EligibleCandidateResource> eligibleCandidates(
            Long recruiterId, String search, Pageable pageable) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        Set<Long> alreadyConnected =
                connectionRepository
                        .findByCompanyIdAndStatusIn(
                                companyId, List.of(ConnectionStatus.values()), Pageable.unpaged())
                        .map(Connection::getCandidateId)
                        .toSet();
        return eligibilityPort
                .search(companyId, search, alreadyConnected, pageable)
                .map(
                        candidate ->
                                EligibleCandidateResource.builder()
                                        .candidateId(candidate.candidateId())
                                        .fullName(candidate.fullName())
                                        .email(candidate.email())
                                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> recruiterConversations(
            Long recruiterId, Pageable pageable) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        return connectionRepository
                .findByCompanyIdAndStatusIn(
                        companyId,
                        List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED),
                        pageable)
                .map(mapper::toConversationSummary);
    }

    private Connection requirePending(Long connectionId, Long candidateId) {
        return connectionRepository
                .findByIdAndCandidateId(connectionId, candidateId)
                .filter(connection -> connection.getStatus() == ConnectionStatus.PENDING)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    @Override
    public MessageResource sendMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            SendMessageRequest request) {
        Connection connection = requireActiveParticipant(connectionId, actorType, actorId);
        if (moderationService.isMuted(actorType, actorId)) {
            throw new AppException(ErrorCode.CONNECT_MUTED);
        }
        moderationService.screen(actorType, actorId, connectionId, request.body());

        Optional<LinkPreview> preview = linkPreviewService.resolve(request.body());
        ConnectionMessage message =
                messageRepository.save(
                        ConnectionMessage.builder()
                                .connectionId(connection.getId())
                                .senderType(actorType)
                                .senderId(actorId)
                                .messageType(
                                        preview.isPresent()
                                                ? ConnectMessageType.LINK
                                                : ConnectMessageType.TEXT)
                                .body(request.body())
                                .linkUrl(preview.map(LinkPreview::url).orElse(null))
                                .linkTitle(preview.map(LinkPreview::title).orElse(null))
                                .linkDescription(preview.map(LinkPreview::description).orElse(null))
                                .linkImageUrl(preview.map(LinkPreview::imageUrl).orElse(null))
                                .build());
        MessageResource resource = mapper.toMessage(message);
        notifyRecipients(connection, actorType, resource);
        return resource;
    }

    @Override
    public MessageResource sendAttachment(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            MultipartFile file,
            String caption) {
        Connection connection = requireActiveParticipant(connectionId, actorType, actorId);
        if (moderationService.isMuted(actorType, actorId)) {
            throw new AppException(ErrorCode.CONNECT_MUTED);
        }
        if (caption != null && !caption.isBlank()) {
            moderationService.screen(actorType, actorId, connectionId, caption);
        }

        byte[] content = readBytes(file);
        FileType detected =
                FileType.detect(content)
                        .orElseThrow(() -> new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE));
        boolean isImage = detected == FileType.JPEG || detected == FileType.PNG;
        StorageTarget target = isImage ? StorageTarget.IMAGE : StorageTarget.CHAT_FILE;
        ConnectMessageType messageType =
                isImage ? ConnectMessageType.IMAGE : ConnectMessageType.FILE;

        StoredFile stored = storageService.upload(file, target, "connect/" + connectionId);
        // FILE attachments stay signed/authenticated (Cloudinary blocks public raw delivery by
        // default); the frontend downloads them through downloadAttachment below instead of a URL.
        String url = isImage ? storageService.publicUrl(stored.publicId(), target) : null;

        ConnectionMessage message =
                messageRepository.save(
                        ConnectionMessage.builder()
                                .connectionId(connection.getId())
                                .senderType(actorType)
                                .senderId(actorId)
                                .messageType(messageType)
                                .body(caption)
                                .attachmentPublicId(stored.publicId())
                                .attachmentUrl(url)
                                .attachmentFileName(stored.originalFileName())
                                .attachmentContentType(stored.contentType())
                                .attachmentFileSizeBytes(stored.sizeInBytes())
                                .build());
        MessageResource resource = mapper.toMessage(message);
        notifyRecipients(connection, actorType, resource);
        return resource;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResource> listMessages(
            ConnectActorType actorType, Long actorId, Long connectionId, Pageable pageable) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        unreadService.clear(actorType, actorId, connectionId);
        boolean redact = connection.getContentHiddenAt() != null;
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        return messageRepository
                .findByConnectionId(connectionId, newestFirst)
                .map(message -> mapper.toMessage(message, redact));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResource> adminListMessages(Long connectionId, Pageable pageable) {
        if (!connectionRepository.existsById(connectionId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        return messageRepository
                .findByConnectionId(connectionId, newestFirst)
                .map(mapper::toMessage);
    }

    @Override
    public AttachmentContent downloadAttachment(
            ConnectActorType actorType, Long actorId, Long connectionId, Long messageId) {
        requireParticipant(connectionId, actorType, actorId);
        ConnectionMessage message =
                messageRepository
                        .findByIdAndConnectionId(messageId, connectionId)
                        .filter(found -> found.getMessageType() == ConnectMessageType.FILE)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        byte[] bytes =
                storageService.fetchDocument(
                        message.getAttachmentPublicId(), StorageTarget.CHAT_FILE);
        return new AttachmentContent(
                message.getAttachmentFileName(), message.getAttachmentContentType(), bytes);
    }

    @Override
    @Transactional
    public void block(ConnectActorType actorType, Long actorId, Long connectionId) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        if (connection.getStatus() == ConnectionStatus.BLOCKED) {
            return;
        }
        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new AppException(ErrorCode.CONNECTION_NOT_ACCEPTED);
        }
        connection.setStatus(ConnectionStatus.BLOCKED);
        connection.setBlockedByActorType(actorType);
        connection.setBlockedByActorId(actorId);
        connection.setBlockedAt(Instant.now());
    }

    @Override
    public void report(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            ReportReasonCode reasonCode,
            String reasonNote) {
        requireParticipant(connectionId, actorType, actorId);
        ReporterType reporterType =
                actorType == ConnectActorType.CANDIDATE
                        ? ReporterType.CANDIDATE
                        : ReporterType.RECRUITER;
        reportService.file(
                reporterType,
                actorId,
                ReportTargetType.CONVERSATION,
                connectionId,
                reasonCode,
                reasonNote);
    }

    private void notifyRecipients(
            Connection connection, ConnectActorType senderType, MessageResource message) {
        if (senderType == ConnectActorType.CANDIDATE) {
            companyService
                    .findActiveMemberIds(connection.getCompanyId())
                    .forEach(
                            recruiterId -> {
                                sseService.publish(
                                        ConnectActorType.RECRUITER, recruiterId, message);
                                unreadService.increment(
                                        ConnectActorType.RECRUITER,
                                        recruiterId,
                                        connection.getId());
                            });
        } else {
            Long candidateId = connection.getCandidateId();
            sseService.publish(ConnectActorType.CANDIDATE, candidateId, message);
            unreadService.increment(ConnectActorType.CANDIDATE, candidateId, connection.getId());
        }
    }

    private Connection requireParticipant(
            Long connectionId, ConnectActorType actorType, Long actorId) {
        Connection connection =
                connectionRepository
                        .findById(connectionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        boolean owns =
                actorType == ConnectActorType.CANDIDATE
                        ? connection.getCandidateId().equals(actorId)
                        : connection.getCompanyId().equals(companyScope.companyIdOf(actorId));
        if (!owns) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return connection;
    }

    private Connection requireActiveParticipant(
            Long connectionId, ConnectActorType actorType, Long actorId) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        if (connection.getStatus() == ConnectionStatus.BLOCKED) {
            throw new AppException(ErrorCode.CONNECTION_BLOCKED);
        }
        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new AppException(ErrorCode.CONNECTION_NOT_ACCEPTED);
        }
        return connection;
    }

    private byte[] readBytes(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw AppException.validation("file", "A file is required");
        }
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
        }
    }
}
