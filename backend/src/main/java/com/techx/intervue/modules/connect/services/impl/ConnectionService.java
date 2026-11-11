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
import com.techx.intervue.modules.connect.entities.ConnectionMessageHide;
import com.techx.intervue.modules.connect.entities.ConnectionMessageReaction;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectMessageType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import com.techx.intervue.modules.connect.enums.UnsendScope;
import com.techx.intervue.modules.connect.events.ConnectSseDispatchEvent;
import com.techx.intervue.modules.connect.events.ConnectSseDispatchEvent.Recipient;
import com.techx.intervue.modules.connect.mappers.ConnectMapper;
import com.techx.intervue.modules.connect.repositories.ConnectionMessageHideRepository;
import com.techx.intervue.modules.connect.repositories.ConnectionMessageReactionRepository;
import com.techx.intervue.modules.connect.repositories.ConnectionMessageRepository;
import com.techx.intervue.modules.connect.repositories.ConnectionRepository;
import com.techx.intervue.modules.connect.requests.EditMessageRequest;
import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.requests.SendMessageRequest;
import com.techx.intervue.modules.connect.resources.ConnectReactionEventPayload;
import com.techx.intervue.modules.connect.resources.ConnectReadEventPayload;
import com.techx.intervue.modules.connect.resources.ConnectStatusEventPayload;
import com.techx.intervue.modules.connect.resources.ConnectTypingEventPayload;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageReactionResource;
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
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConnectionService implements ConnectionServiceInterface {

    private static final Duration EDIT_WINDOW = Duration.ofMinutes(15);
    private static final Sort NEWEST_FIRST = Sort.by(Sort.Order.desc("id"));
    private static final List<ConnectionStatus> RECRUITER_VISIBLE_STATUSES =
            List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED, ConnectionStatus.BLOCKED);
    private static final List<ConnectionStatus> CANDIDATE_VISIBLE_STATUSES =
            List.of(ConnectionStatus.ACCEPTED, ConnectionStatus.BLOCKED);
    private static final Set<String> ALLOWED_REACTIONS = Set.of("👍", "❤️", "😂", "😮", "😢", "🙏");

    private final ConnectionRepository connectionRepository;
    private final ConnectionMessageRepository messageRepository;
    private final ConnectionMessageReactionRepository reactionRepository;
    private final ConnectionMessageHideRepository hideRepository;
    private final CandidateEligibilityPortInterface eligibilityPort;
    private final ConnectQuotaServiceInterface quotaService;
    private final ConnectCompanyScope companyScope;
    private final CompanyServiceInterface companyService;
    private final RecruiterServiceInterface recruiterService;
    private final NotificationPublisherInterface notificationPublisher;
    private final ConnectModerationServiceInterface moderationService;
    private final LinkPreviewServiceInterface linkPreviewService;
    private final StorageServiceInterface storageService;
    private final ConnectSseServiceInterface sseService;
    private final ConnectUnreadServiceInterface unreadService;
    private final ReportServiceInterface reportService;
    private final ApplicationEventPublisher eventPublisher;
    private final TransactionTemplate transactionTemplate;
    private final ConnectMapper mapper;

    @Override
    public InvitationResource invite(Long recruiterId, SendInvitationRequest request) {
        if (moderationService.isMuted(ConnectActorType.RECRUITER, recruiterId)) {
            throw new AppException(ErrorCode.CONNECT_MUTED);
        }
        moderationService.screen(ConnectActorType.RECRUITER, recruiterId, null, request.message());

        Long companyId = companyScope.companyIdOf(recruiterId);
        if (connectionRepository.existsByCandidateIdAndCompanyId(
                request.candidateId(), companyId)) {
            throw new AppException(ErrorCode.CONNECTION_ALREADY_EXISTS);
        }
        EligibleCandidate candidate =
                eligibilityPort
                        .findCandidateSummary(request.candidateId(), companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_ELIGIBLE_TO_CONNECT));

        return transactionTemplate.execute(
                status -> {
                    quotaService.reserve(recruiterId);
                    CompanySummaryResource company = companyService.findSummary(companyId);

                    Instant now = Instant.now();
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
                                            .invitedAt(now)
                                            .lastMessageAt(now)
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
                                    .actionUrl("/candidate/conversations/c/" + connection.getId())
                                    .build());

                    eventPublisher.publishEvent(
                            new ConnectSseDispatchEvent(
                                    allParticipants(connection),
                                    "status",
                                    new ConnectStatusEventPayload(
                                            connection.getId(), ConnectionStatus.PENDING, null)));

                    return mapper.toInvitation(connection, request.message());
                });
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
                        .actionUrl("/recruiter/conversations/c/" + connection.getId())
                        .build());

        eventPublisher.publishEvent(
                new ConnectSseDispatchEvent(
                        allParticipants(connection),
                        "status",
                        new ConnectStatusEventPayload(
                                connection.getId(), ConnectionStatus.ACCEPTED, null)));
    }

    @Override
    @Transactional
    public void decline(Long candidateId, Long connectionId) {
        Connection connection = requirePending(connectionId, candidateId);
        connection.setStatus(ConnectionStatus.DECLINED);
        connection.setRespondedAt(Instant.now());

        eventPublisher.publishEvent(
                new ConnectSseDispatchEvent(
                        allParticipants(connection),
                        "status",
                        new ConnectStatusEventPayload(
                                connection.getId(), ConnectionStatus.DECLINED, null)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> candidateInvitations(
            Long candidateId, Pageable pageable) {
        Pageable sorted =
                pageable.getSort().isSorted()
                        ? pageable
                        : PageRequest.of(
                                pageable.getPageNumber(),
                                pageable.getPageSize(),
                                Sort.by(Sort.Order.desc("invitedAt"), Sort.Order.desc("id")));
        Page<Connection> page =
                connectionRepository.findByCandidateIdAndStatus(
                        candidateId, ConnectionStatus.PENDING, sorted);
        Map<Long, ConnectionMessage> latestByConnection =
                loadLatestMessagesForViewer(
                        page.getContent(), ConnectActorType.CANDIDATE, candidateId);
        return page.map(
                connection ->
                        mapper.toConversationSummary(
                                connection,
                                ConnectActorType.CANDIDATE,
                                0L,
                                latestByConnection.get(connection.getId())));
    }

    @Override
    @Transactional(readOnly = true)
    public long countPendingInvitations(Long candidateId) {
        return connectionRepository.countByCandidateIdAndStatus(
                candidateId, ConnectionStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> candidateConversations(
            Long candidateId, Pageable pageable) {
        Pageable sorted =
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by(Sort.Order.desc("lastMessageAt"), Sort.Order.desc("id")));
        Map<Long, Long> unreadByConnection =
                unreadService.breakdown(ConnectActorType.CANDIDATE, candidateId);
        Page<Connection> page =
                connectionRepository.findByCandidateIdAndStatusIn(
                        candidateId, CANDIDATE_VISIBLE_STATUSES, sorted);
        Map<Long, ConnectionMessage> latestByConnection =
                loadLatestMessagesForViewer(
                        page.getContent(), ConnectActorType.CANDIDATE, candidateId);
        return page.map(
                connection ->
                        mapper.toConversationSummary(
                                connection,
                                ConnectActorType.CANDIDATE,
                                unreadByConnection.getOrDefault(connection.getId(), 0L),
                                latestByConnection.get(connection.getId())));
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
        Pageable sorted =
                pageable.getSort().isSorted()
                        ? pageable
                        : PageRequest.of(
                                pageable.getPageNumber(),
                                pageable.getPageSize(),
                                Sort.by(Sort.Order.desc("submittedAt"), Sort.Order.desc("id")));
        return eligibilityPort
                .search(companyId, search, alreadyConnected, sorted)
                .map(
                        candidate ->
                                EligibleCandidateResource.builder()
                                        .candidateId(candidate.candidateId())
                                        .fullName(candidate.fullName())
                                        .email(candidate.email())
                                        .jobTitle(candidate.jobTitle())
                                        .submittedAt(candidate.submittedAt())
                                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> recruiterConversations(
            Long recruiterId, Pageable pageable) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        Pageable sorted =
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by(Sort.Order.desc("lastMessageAt"), Sort.Order.desc("id")));
        Page<Connection> connections =
                connectionRepository.findByCompanyIdAndStatusIn(
                        companyId, RECRUITER_VISIBLE_STATUSES, sorted);
        Map<Long, Long> unreadByConnection =
                unreadService.breakdown(ConnectActorType.RECRUITER, recruiterId);
        Map<Long, ConnectionMessage> latestByConnection =
                loadLatestMessagesForViewer(
                        connections.getContent(), ConnectActorType.RECRUITER, recruiterId);
        return connections.map(
                connection ->
                        mapper.toConversationSummary(
                                connection,
                                ConnectActorType.RECRUITER,
                                unreadByConnection.getOrDefault(connection.getId(), 0L),
                                latestByConnection.get(connection.getId())));
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationSummaryResource getConversation(
            ConnectActorType actorType, Long actorId, Long connectionId) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        long unreadCount =
                unreadService.breakdown(actorType, actorId).getOrDefault(connectionId, 0L);
        ConnectionMessage latest =
                messageRepository
                        .findLatestVisibleForActor(
                                connectionId, actorType, actorId, PageRequest.of(0, 1))
                        .stream()
                        .findFirst()
                        .orElse(null);
        return mapper.toConversationSummary(connection, actorType, unreadCount, latest);
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
        String clientMessageId = normalizeClientMessageId(request.clientMessageId());
        Optional<ConnectionMessage> existing =
                findExistingByClientMessageId(connectionId, actorType, actorId, clientMessageId);
        if (existing.isPresent()) {
            return hydrateSingleMessage(connection, existing.get(), actorType, actorId);
        }

        validateReplyTarget(connectionId, request.replyToMessageId());
        if (moderationService.isMuted(actorType, actorId)) {
            throw new AppException(ErrorCode.CONNECT_MUTED);
        }
        moderationService.screen(actorType, actorId, connectionId, request.body());

        Optional<LinkPreview> preview =
                Boolean.TRUE.equals(request.suppressLinkPreview())
                        ? Optional.empty()
                        : linkPreviewService.resolve(request.body());

        try {
            MessageResource resource =
                    transactionTemplate.execute(
                            status -> {
                                Connection fresh =
                                        requireActiveParticipant(connectionId, actorType, actorId);
                                ConnectionMessage saved =
                                        messageRepository.save(
                                                ConnectionMessage.builder()
                                                        .connectionId(fresh.getId())
                                                        .senderType(actorType)
                                                        .senderId(actorId)
                                                        .clientMessageId(clientMessageId)
                                                        .replyToMessageId(
                                                                request.replyToMessageId())
                                                        .messageType(
                                                                preview.isPresent()
                                                                        ? ConnectMessageType.LINK
                                                                        : ConnectMessageType.TEXT)
                                                        .body(request.body())
                                                        .linkUrl(
                                                                preview.map(LinkPreview::url)
                                                                        .orElse(null))
                                                        .linkTitle(
                                                                preview.map(LinkPreview::title)
                                                                        .orElse(null))
                                                        .linkDescription(
                                                                preview.map(
                                                                                LinkPreview
                                                                                        ::description)
                                                                        .orElse(null))
                                                        .linkImageUrl(
                                                                preview.map(LinkPreview::imageUrl)
                                                                        .orElse(null))
                                                        .build());

                                updateLastMessageAndSenderCursor(fresh, actorType, saved);
                                MessageResource mapped =
                                        hydrateSingleMessage(fresh, saved, actorType, actorId);
                                eventPublisher.publishEvent(
                                        new ConnectSseDispatchEvent(
                                                allParticipants(fresh), "message", mapped));
                                return mapped;
                            });
            incrementPeerUnread(connection, actorType);
            return resource;
        } catch (DataIntegrityViolationException e) {
            Optional<ConnectionMessage> duplicate =
                    findExistingByClientMessageId(
                            connectionId, actorType, actorId, clientMessageId);
            if (duplicate.isPresent()) {
                return hydrateSingleMessage(connection, duplicate.get(), actorType, actorId);
            }
            throw e;
        }
    }

    @Override
    public MessageResource sendAttachment(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            MultipartFile file,
            String caption,
            String rawClientMessageId,
            Long replyToMessageId) {
        Connection connection = requireActiveParticipant(connectionId, actorType, actorId);
        String clientMessageId = normalizeClientMessageId(rawClientMessageId);
        Optional<ConnectionMessage> existing =
                findExistingByClientMessageId(connectionId, actorType, actorId, clientMessageId);
        if (existing.isPresent()) {
            return hydrateSingleMessage(connection, existing.get(), actorType, actorId);
        }

        validateReplyTarget(connectionId, replyToMessageId);
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

        try {
            MessageResource resource =
                    transactionTemplate.execute(
                            status -> {
                                Connection fresh =
                                        requireActiveParticipant(connectionId, actorType, actorId);
                                ConnectionMessage saved =
                                        messageRepository.save(
                                                ConnectionMessage.builder()
                                                        .connectionId(fresh.getId())
                                                        .senderType(actorType)
                                                        .senderId(actorId)
                                                        .clientMessageId(clientMessageId)
                                                        .replyToMessageId(replyToMessageId)
                                                        .messageType(messageType)
                                                        .body(caption)
                                                        .attachmentPublicId(stored.publicId())
                                                        .attachmentUrl(url)
                                                        .attachmentFileName(
                                                                stored.originalFileName())
                                                        .attachmentContentType(stored.contentType())
                                                        .attachmentFileSizeBytes(
                                                                stored.sizeInBytes())
                                                        .build());

                                updateLastMessageAndSenderCursor(fresh, actorType, saved);
                                MessageResource mapped =
                                        hydrateSingleMessage(fresh, saved, actorType, actorId);
                                eventPublisher.publishEvent(
                                        new ConnectSseDispatchEvent(
                                                allParticipants(fresh), "message", mapped));
                                return mapped;
                            });
            incrementPeerUnread(connection, actorType);
            return resource;
        } catch (DataIntegrityViolationException e) {
            Optional<ConnectionMessage> duplicate =
                    findExistingByClientMessageId(
                            connectionId, actorType, actorId, clientMessageId);
            if (duplicate.isPresent()) {
                deleteStoredObjectQuietly(stored.publicId(), target);
                return hydrateSingleMessage(connection, duplicate.get(), actorType, actorId);
            }
            throw e;
        }
    }

    @Override
    public MessageResource editMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long messageId,
            EditMessageRequest request) {
        Connection connection = requireActiveParticipant(connectionId, actorType, actorId);
        ConnectionMessage initial =
                messageRepository
                        .findByIdAndConnectionId(messageId, connectionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (initial.getSenderType() != actorType || !initial.getSenderId().equals(actorId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        if (initial.getRecalledAt() != null) {
            throw new AppException(ErrorCode.MESSAGE_ALREADY_RECALLED);
        }
        if (initial.getMessageType() != ConnectMessageType.TEXT
                && initial.getMessageType() != ConnectMessageType.LINK) {
            throw new AppException(ErrorCode.MESSAGE_NOT_EDITABLE);
        }
        if (initial.getCreatedAt().plus(EDIT_WINDOW).isBefore(Instant.now())) {
            throw new AppException(ErrorCode.MESSAGE_EDIT_WINDOW_EXPIRED);
        }
        if (moderationService.isMuted(actorType, actorId)) {
            throw new AppException(ErrorCode.CONNECT_MUTED);
        }
        moderationService.screen(actorType, actorId, connectionId, request.body());

        Optional<LinkPreview> preview =
                Boolean.TRUE.equals(request.suppressLinkPreview())
                        ? Optional.empty()
                        : linkPreviewService.resolve(request.body());

        return transactionTemplate.execute(
                status -> {
                    Connection freshConn =
                            requireActiveParticipant(connectionId, actorType, actorId);
                    ConnectionMessage message =
                            messageRepository
                                    .findByIdAndConnectionId(messageId, connectionId)
                                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                    if (message.getRecalledAt() != null) {
                        throw new AppException(ErrorCode.MESSAGE_ALREADY_RECALLED);
                    }
                    message.setBody(request.body());
                    message.setEditedAt(Instant.now());
                    message.setMessageType(
                            preview.isPresent()
                                    ? ConnectMessageType.LINK
                                    : ConnectMessageType.TEXT);
                    message.setLinkUrl(preview.map(LinkPreview::url).orElse(null));
                    message.setLinkTitle(preview.map(LinkPreview::title).orElse(null));
                    message.setLinkDescription(preview.map(LinkPreview::description).orElse(null));
                    message.setLinkImageUrl(preview.map(LinkPreview::imageUrl).orElse(null));
                    ConnectionMessage saved = messageRepository.save(message);

                    MessageResource resource =
                            hydrateSingleMessage(freshConn, saved, actorType, actorId);
                    eventPublisher.publishEvent(
                            new ConnectSseDispatchEvent(
                                    allParticipants(freshConn), "message_updated", resource));
                    return resource;
                });
    }

    @Override
    public MessageResource unsendMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long messageId,
            UnsendScope scope) {
        if (scope == UnsendScope.ME) {
            transactionTemplate.executeWithoutResult(
                    status -> {
                        requireParticipant(connectionId, actorType, actorId);
                        messageRepository
                                .findByIdAndConnectionId(messageId, connectionId)
                                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                        if (!hideRepository.existsByMessageIdAndActorTypeAndActorId(
                                messageId, actorType, actorId)) {
                            hideRepository.save(
                                    ConnectionMessageHide.builder()
                                            .messageId(messageId)
                                            .actorType(actorType)
                                            .actorId(actorId)
                                            .build());
                        }
                    });
            return null;
        }

        final String[] attachmentToDelete = new String[1];
        final ConnectMessageType[] oldType = new ConnectMessageType[1];

        MessageResource result =
                transactionTemplate.execute(
                        status -> {
                            Connection connection =
                                    requireActiveParticipant(connectionId, actorType, actorId);
                            ConnectionMessage message =
                                    messageRepository
                                            .findByIdAndConnectionId(messageId, connectionId)
                                            .orElseThrow(
                                                    () -> new AppException(ErrorCode.NOT_FOUND));
                            if (message.getSenderType() != actorType
                                    || !message.getSenderId().equals(actorId)) {
                                throw new AppException(ErrorCode.FORBIDDEN);
                            }
                            if (message.getRecalledAt() != null) {
                                return hydrateSingleMessage(
                                        connection, message, actorType, actorId);
                            }

                            attachmentToDelete[0] = message.getAttachmentPublicId();
                            oldType[0] = message.getMessageType();

                            message.setBody(null);
                            message.setAttachmentPublicId(null);
                            message.setAttachmentUrl(null);
                            message.setAttachmentFileName(null);
                            message.setAttachmentContentType(null);
                            message.setAttachmentFileSizeBytes(null);
                            message.setLinkUrl(null);
                            message.setLinkTitle(null);
                            message.setLinkDescription(null);
                            message.setLinkImageUrl(null);
                            message.setRecalledAt(Instant.now());
                            message.setRecalledByType(actorType);
                            message.setRecalledById(actorId);

                            List<ConnectionMessageReaction> existingReactions =
                                    reactionRepository.findByMessageIdOrderByIdAsc(messageId);
                            if (!existingReactions.isEmpty()) {
                                reactionRepository.deleteAll(existingReactions);
                            }

                            ConnectionMessage saved = messageRepository.save(message);
                            MessageResource resource =
                                    hydrateSingleMessage(connection, saved, actorType, actorId);
                            eventPublisher.publishEvent(
                                    new ConnectSseDispatchEvent(
                                            allParticipants(connection),
                                            "message_updated",
                                            resource));
                            return resource;
                        });

        if (attachmentToDelete[0] != null) {
            StorageTarget target =
                    oldType[0] == ConnectMessageType.IMAGE
                            ? StorageTarget.IMAGE
                            : StorageTarget.CHAT_FILE;
            deleteStoredObjectQuietly(attachmentToDelete[0], target);
        }
        return result;
    }

    @Override
    @Transactional
    public List<MessageReactionResource> reactToMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long messageId,
            String rawEmoji) {
        String emoji = rawEmoji == null ? "" : rawEmoji.trim();
        if (!ALLOWED_REACTIONS.contains(emoji)) {
            throw new AppException(ErrorCode.CONNECT_REACTION_INVALID);
        }

        Connection connection = requireActiveParticipant(connectionId, actorType, actorId);
        ConnectionMessage message =
                messageRepository
                        .findByIdAndConnectionId(messageId, connectionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (message.getRecalledAt() != null) {
            throw new AppException(ErrorCode.MESSAGE_ALREADY_RECALLED);
        }
        if (hideRepository.existsByMessageIdAndActorTypeAndActorId(messageId, actorType, actorId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        Optional<ConnectionMessageReaction> existing =
                reactionRepository.findByMessageIdAndActorTypeAndActorId(
                        messageId, actorType, actorId);
        if (existing.isPresent()) {
            ConnectionMessageReaction current = existing.get();
            if (current.getEmoji().equals(emoji)) {
                reactionRepository.delete(current);
            } else {
                current.setEmoji(emoji);
                reactionRepository.save(current);
            }
        } else {
            reactionRepository.save(
                    ConnectionMessageReaction.builder()
                            .messageId(messageId)
                            .actorType(actorType)
                            .actorId(actorId)
                            .emoji(emoji)
                            .build());
        }
        reactionRepository.flush();

        List<ConnectionMessageReaction> updated =
                reactionRepository.findByMessageIdOrderByIdAsc(messageId);
        Set<Long> recruiterIds =
                updated.stream()
                        .filter(r -> r.getActorType() == ConnectActorType.RECRUITER)
                        .map(ConnectionMessageReaction::getActorId)
                        .collect(Collectors.toSet());
        Map<Long, String> recruiterNames = loadRecruiterNames(recruiterIds);
        List<MessageReactionResource> resources =
                mapper.toReactionResources(updated, connection, recruiterNames);

        eventPublisher.publishEvent(
                new ConnectSseDispatchEvent(
                        allParticipants(connection),
                        "reaction",
                        new ConnectReactionEventPayload(connectionId, messageId, resources)));
        return resources;
    }

    @Override
    @Transactional
    public void markAsRead(
            ConnectActorType actorType, Long actorId, Long connectionId, Long lastReadMessageId) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        unreadService.clear(actorType, actorId, connectionId);

        Long targetId = lastReadMessageId;
        if (targetId != null) {
            messageRepository
                    .findByIdAndConnectionId(targetId, connectionId)
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        } else {
            targetId =
                    messageRepository
                            .findLatestVisibleForActor(
                                    connectionId, actorType, actorId, PageRequest.of(0, 1))
                            .stream()
                            .findFirst()
                            .map(ConnectionMessage::getId)
                            .orElse(null);
        }
        if (targetId == null) {
            return;
        }

        Instant now = Instant.now();
        boolean advanced = false;
        if (actorType == ConnectActorType.CANDIDATE) {
            Long current = connection.getCandidateLastReadMessageId();
            if (current == null || targetId > current) {
                connection.setCandidateLastReadMessageId(targetId);
                connection.setCandidateLastReadAt(now);
                advanced = true;
            }
        } else {
            Long current = connection.getRecruiterLastReadMessageId();
            if (current == null || targetId > current) {
                connection.setRecruiterLastReadMessageId(targetId);
                connection.setRecruiterLastReadAt(now);
                advanced = true;
            }
        }

        if (advanced) {
            connectionRepository.save(connection);
            eventPublisher.publishEvent(
                    new ConnectSseDispatchEvent(
                            otherParticipants(connection, actorType, actorId),
                            "read",
                            new ConnectReadEventPayload(
                                    connectionId, actorType, actorId, targetId, now)));
        }
    }

    @Override
    public void sendTyping(
            ConnectActorType actorType, Long actorId, Long connectionId, boolean typing) {
        Connection connection = requireActiveParticipant(connectionId, actorType, actorId);
        String actorName =
                actorType == ConnectActorType.CANDIDATE
                        ? connection.getCandidateName()
                        : loadRecruiterNames(Set.of(actorId))
                                .getOrDefault(actorId, connection.getCompanyName());
        ConnectTypingEventPayload payload =
                new ConnectTypingEventPayload(connectionId, actorType, actorId, actorName, typing);
        for (Recipient recipient : otherParticipants(connection, actorType, actorId)) {
            sseService.publishEvent(recipient.actorType(), recipient.actorId(), "typing", payload);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResource> listMessages(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long beforeId,
            Pageable pageable) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        boolean redact = connection.getContentHiddenAt() != null;
        int pageIndex = beforeId != null ? 0 : pageable.getPageNumber();
        Pageable newestFirst = PageRequest.of(pageIndex, pageable.getPageSize(), NEWEST_FIRST);
        Page<ConnectionMessage> page =
                messageRepository.findVisiblePageForActor(
                        connectionId, beforeId, actorType, actorId, newestFirst);
        return hydrateMessagePage(connection, page, redact, actorType, actorId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResource> adminListMessages(Long connectionId, Pageable pageable) {
        Connection connection =
                connectionRepository
                        .findById(connectionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        Page<ConnectionMessage> page =
                messageRepository.findByConnectionId(connectionId, newestFirst);
        return hydrateMessagePage(connection, page, false, null, null);
    }

    @Override
    public AttachmentContent downloadAttachment(
            ConnectActorType actorType, Long actorId, Long connectionId, Long messageId) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        if (connection.getContentHiddenAt() != null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        if (hideRepository.existsByMessageIdAndActorTypeAndActorId(messageId, actorType, actorId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        ConnectionMessage message =
                messageRepository
                        .findByIdAndConnectionId(messageId, connectionId)
                        .filter(found -> found.getMessageType() == ConnectMessageType.FILE)
                        .filter(found -> found.getRecalledAt() == null)
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

        eventPublisher.publishEvent(
                new ConnectSseDispatchEvent(
                        allParticipants(connection),
                        "status",
                        new ConnectStatusEventPayload(
                                connection.getId(), ConnectionStatus.BLOCKED, actorType)));
    }

    @Override
    @Transactional
    public void unblock(ConnectActorType actorType, Long actorId, Long connectionId) {
        Connection connection = requireParticipant(connectionId, actorType, actorId);
        if (connection.getStatus() != ConnectionStatus.BLOCKED) {
            throw new AppException(ErrorCode.CONNECTION_NOT_BLOCKED);
        }
        if (connection.getBlockedByActorType() != actorType) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setBlockedByActorType(null);
        connection.setBlockedByActorId(null);
        connection.setBlockedAt(null);

        eventPublisher.publishEvent(
                new ConnectSseDispatchEvent(
                        allParticipants(connection),
                        "status",
                        new ConnectStatusEventPayload(
                                connection.getId(), ConnectionStatus.ACCEPTED, null)));
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

    private Page<MessageResource> hydrateMessagePage(
            Connection connection,
            Page<ConnectionMessage> page,
            boolean redact,
            ConnectActorType viewerType,
            Long viewerId) {
        List<ConnectionMessage> messages = page.getContent();
        if (messages.isEmpty()) {
            return Page.empty(page.getPageable());
        }

        List<Long> messageIds = messages.stream().map(ConnectionMessage::getId).toList();
        Map<Long, ConnectionMessage> messageById = new HashMap<>();
        for (ConnectionMessage m : messages) {
            messageById.put(m.getId(), m);
        }

        Set<Long> missingReplyIds =
                messages.stream()
                        .map(ConnectionMessage::getReplyToMessageId)
                        .filter(Objects::nonNull)
                        .filter(id -> !messageById.containsKey(id))
                        .collect(Collectors.toSet());
        if (!missingReplyIds.isEmpty()) {
            messageRepository
                    .findAllById(missingReplyIds)
                    .forEach(target -> messageById.put(target.getId(), target));
        }

        Set<Long> replyIds =
                messages.stream()
                        .map(ConnectionMessage::getReplyToMessageId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());
        Set<Long> hiddenReplyIds = new HashSet<>();
        if (!replyIds.isEmpty() && viewerType != null && viewerId != null) {
            hideRepository
                    .findByMessageIdInAndActorTypeAndActorId(replyIds, viewerType, viewerId)
                    .forEach(hide -> hiddenReplyIds.add(hide.getMessageId()));
        }

        Map<Long, List<ConnectionMessageReaction>> reactionsByMessage =
                reactionRepository.findByMessageIdInOrderByIdAsc(messageIds).stream()
                        .collect(Collectors.groupingBy(ConnectionMessageReaction::getMessageId));

        Set<Long> recruiterIds = new HashSet<>();
        for (ConnectionMessage m : messages) {
            if (m.getSenderType() == ConnectActorType.RECRUITER) {
                recruiterIds.add(m.getSenderId());
            }
            Long replyId = m.getReplyToMessageId();
            if (replyId != null) {
                ConnectionMessage replyTarget = messageById.get(replyId);
                if (replyTarget != null
                        && replyTarget.getSenderType() == ConnectActorType.RECRUITER) {
                    recruiterIds.add(replyTarget.getSenderId());
                }
            }
        }
        reactionsByMessage
                .values()
                .forEach(
                        list ->
                                list.stream()
                                        .filter(r -> r.getActorType() == ConnectActorType.RECRUITER)
                                        .map(ConnectionMessageReaction::getActorId)
                                        .forEach(recruiterIds::add));

        Map<Long, String> recruiterNames = loadRecruiterNames(recruiterIds);

        return page.map(
                message -> {
                    ConnectionMessage replyTarget =
                            message.getReplyToMessageId() != null
                                    ? messageById.get(message.getReplyToMessageId())
                                    : null;
                    if (replyTarget != null && hiddenReplyIds.contains(replyTarget.getId())) {
                        replyTarget = maskedReplyStub(replyTarget);
                    }
                    return mapper.toMessage(
                            message,
                            redact,
                            connection,
                            replyTarget,
                            recruiterNames,
                            reactionsByMessage.getOrDefault(message.getId(), List.of()));
                });
    }

    private MessageResource hydrateSingleMessage(
            Connection connection,
            ConnectionMessage message,
            ConnectActorType viewerType,
            Long viewerId) {
        ConnectionMessage replyTarget = null;
        if (message.getReplyToMessageId() != null) {
            replyTarget = messageRepository.findById(message.getReplyToMessageId()).orElse(null);
            if (replyTarget != null
                    && viewerType != null
                    && viewerId != null
                    && hideRepository.existsByMessageIdAndActorTypeAndActorId(
                            replyTarget.getId(), viewerType, viewerId)) {
                replyTarget = maskedReplyStub(replyTarget);
            }
        }
        List<ConnectionMessageReaction> reactions =
                message.getId() != null
                        ? reactionRepository.findByMessageIdOrderByIdAsc(message.getId())
                        : List.of();
        Set<Long> recruiterIds = new HashSet<>();
        if (message.getSenderType() == ConnectActorType.RECRUITER) {
            recruiterIds.add(message.getSenderId());
        }
        if (replyTarget != null && replyTarget.getSenderType() == ConnectActorType.RECRUITER) {
            recruiterIds.add(replyTarget.getSenderId());
        }
        reactions.stream()
                .filter(r -> r.getActorType() == ConnectActorType.RECRUITER)
                .map(ConnectionMessageReaction::getActorId)
                .forEach(recruiterIds::add);
        return mapper.toMessage(
                message,
                false,
                connection,
                replyTarget,
                loadRecruiterNames(recruiterIds),
                reactions);
    }

    private ConnectionMessage maskedReplyStub(ConnectionMessage original) {
        return ConnectionMessage.builder()
                .id(original.getId())
                .connectionId(original.getConnectionId())
                .senderType(original.getSenderType())
                .senderId(original.getSenderId())
                .messageType(original.getMessageType())
                .recalledAt(Instant.now())
                .build();
    }

    private Map<Long, ConnectionMessage> loadLatestMessagesForViewer(
            List<Connection> connections, ConnectActorType viewerType, Long viewerId) {
        if (connections.isEmpty()) {
            return Map.of();
        }
        List<Long> connectionIds = connections.stream().map(Connection::getId).toList();
        return messageRepository
                .findLatestVisibleByConnectionIdsForActor(connectionIds, viewerType, viewerId)
                .stream()
                .collect(
                        Collectors.toMap(
                                ConnectionMessage::getConnectionId,
                                Function.identity(),
                                (a, b) -> a.getId() >= b.getId() ? a : b));
    }

    private Map<Long, String> loadRecruiterNames(Set<Long> recruiterIds) {
        if (recruiterIds == null || recruiterIds.isEmpty()) {
            return Map.of();
        }
        return recruiterService.findByIds(recruiterIds).stream()
                .collect(
                        Collectors.toMap(
                                RecruiterResource::id,
                                r -> r.name() != null ? r.name() : "Recruiter",
                                (a, b) -> a));
    }

    private void updateLastMessageAndSenderCursor(
            Connection connection, ConnectActorType actorType, ConnectionMessage saved) {
        Instant timestamp = saved.getCreatedAt() != null ? saved.getCreatedAt() : Instant.now();
        connection.setLastMessageAt(timestamp);
        if (actorType == ConnectActorType.CANDIDATE) {
            Long current = connection.getCandidateLastReadMessageId();
            if (current == null || saved.getId() > current) {
                connection.setCandidateLastReadMessageId(saved.getId());
                connection.setCandidateLastReadAt(timestamp);
            }
        } else {
            Long current = connection.getRecruiterLastReadMessageId();
            if (current == null || saved.getId() > current) {
                connection.setRecruiterLastReadMessageId(saved.getId());
                connection.setRecruiterLastReadAt(timestamp);
            }
        }
        connectionRepository.save(connection);
    }

    private void incrementPeerUnread(Connection connection, ConnectActorType senderType) {
        if (senderType == ConnectActorType.CANDIDATE) {
            companyService
                    .findActiveMemberIds(connection.getCompanyId())
                    .forEach(
                            recruiterId ->
                                    unreadService.increment(
                                            ConnectActorType.RECRUITER,
                                            recruiterId,
                                            connection.getId()));
        } else {
            unreadService.increment(
                    ConnectActorType.CANDIDATE, connection.getCandidateId(), connection.getId());
        }
    }

    private List<Recipient> allParticipants(Connection connection) {
        List<Recipient> recipients = new ArrayList<>();
        recipients.add(new Recipient(ConnectActorType.CANDIDATE, connection.getCandidateId()));
        companyService
                .findActiveMemberIds(connection.getCompanyId())
                .forEach(id -> recipients.add(new Recipient(ConnectActorType.RECRUITER, id)));
        return recipients;
    }

    private List<Recipient> otherParticipants(
            Connection connection, ConnectActorType excludeType, Long excludeId) {
        return allParticipants(connection).stream()
                .filter(
                        recipient ->
                                !(recipient.actorType() == excludeType
                                        && recipient.actorId().equals(excludeId)))
                .toList();
    }

    private Optional<ConnectionMessage> findExistingByClientMessageId(
            Long connectionId, ConnectActorType senderType, Long senderId, String clientMessageId) {
        if (clientMessageId == null) {
            return Optional.empty();
        }
        return messageRepository.findByConnectionIdAndSenderTypeAndSenderIdAndClientMessageId(
                connectionId, senderType, senderId, clientMessageId);
    }

    private String normalizeClientMessageId(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.length() > 64 ? trimmed.substring(0, 64) : trimmed;
    }

    private void validateReplyTarget(Long connectionId, Long replyToMessageId) {
        if (replyToMessageId == null) {
            return;
        }
        messageRepository
                .findByIdAndConnectionId(replyToMessageId, connectionId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void deleteStoredObjectQuietly(String publicId, StorageTarget target) {
        try {
            storageService.delete(publicId, target);
        } catch (Exception e) {
            log.warn("Failed to delete unsent attachment {}: {}", publicId, e.getMessage());
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
