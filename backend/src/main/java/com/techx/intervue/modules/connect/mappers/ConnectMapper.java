package com.techx.intervue.modules.connect.mappers;

import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import com.techx.intervue.modules.connect.entities.ConnectionMessageReaction;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageReactionResource;
import com.techx.intervue.modules.connect.resources.MessageReplyResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ConnectMapper {

    private static final int PREVIEW_MAX_LENGTH = 80;

    public InvitationResource toInvitation(Connection connection, String openingMessage) {
        return InvitationResource.builder()
                .id(connection.getId())
                .companyId(connection.getCompanyId())
                .companyName(connection.getCompanyName())
                .openingMessage(openingMessage)
                .invitedAt(connection.getInvitedAt())
                .build();
    }

    public ConversationSummaryResource toConversationSummary(Connection connection) {
        return toConversationSummary(connection, ConnectActorType.CANDIDATE, 0, null);
    }

    public ConversationSummaryResource toConversationSummary(
            Connection connection,
            ConnectActorType viewerType,
            long unreadCount,
            ConnectionMessage latestMessage) {
        boolean viewerIsCandidate = viewerType == ConnectActorType.CANDIDATE;
        return ConversationSummaryResource.builder()
                .id(connection.getId())
                .status(connection.getStatus())
                .blockedByActorType(
                        connection.getStatus() == ConnectionStatus.BLOCKED
                                ? connection.getBlockedByActorType()
                                : null)
                .companyId(connection.getCompanyId())
                .companyName(connection.getCompanyName())
                .candidateId(connection.getCandidateId())
                .candidateName(connection.getCandidateName())
                .invitedAt(connection.getInvitedAt())
                .respondedAt(connection.getRespondedAt())
                .unreadCount(unreadCount)
                .lastMessageAt(latestMessage == null ? null : latestMessage.getCreatedAt())
                .lastMessagePreview(
                        latestMessage == null
                                ? null
                                : lastMessagePreview(connection, latestMessage))
                .peerLastReadMessageId(
                        viewerIsCandidate
                                ? connection.getRecruiterLastReadMessageId()
                                : connection.getCandidateLastReadMessageId())
                .peerLastReadAt(
                        viewerIsCandidate
                                ? connection.getRecruiterLastReadAt()
                                : connection.getCandidateLastReadAt())
                .build();
    }

    private String lastMessagePreview(Connection connection, ConnectionMessage message) {
        if (connection.getContentHiddenAt() != null) {
            return "Content has been hidden";
        }
        if (message.getRecalledAt() != null) {
            return "Message unsent";
        }
        return switch (message.getMessageType()) {
            case IMAGE -> "Sent an image";
            case FILE -> "Sent an attachment";
            case LINK ->
                    message.getLinkTitle() != null
                            ? message.getLinkTitle()
                            : truncate(message.getBody());
            case TEXT -> truncate(message.getBody());
        };
    }

    private String truncate(String text) {
        if (text == null) {
            return null;
        }
        return text.length() > PREVIEW_MAX_LENGTH
                ? text.substring(0, PREVIEW_MAX_LENGTH) + "…"
                : text;
    }

    public MessageResource toMessage(ConnectionMessage message) {
        return toMessage(message, false, null, null, Map.of(), List.of());
    }

    public MessageResource toMessage(
            ConnectionMessage message,
            boolean redact,
            Connection connection,
            ConnectionMessage replyTarget,
            Map<Long, String> recruiterNames,
            List<ConnectionMessageReaction> reactionEntities) {
        boolean recalled = message.getRecalledAt() != null;
        String senderName =
                resolveActorName(
                        message.getSenderType(), message.getSenderId(), connection, recruiterNames);

        MessageResource.MessageResourceBuilder builder =
                MessageResource.builder()
                        .id(message.getId())
                        .connectionId(message.getConnectionId())
                        .senderType(message.getSenderType())
                        .senderId(message.getSenderId())
                        .senderName(senderName)
                        .clientMessageId(message.getClientMessageId())
                        .replyToMessageId(message.getReplyToMessageId())
                        .messageType(message.getMessageType())
                        .createdAt(message.getCreatedAt())
                        .editedAt(message.getEditedAt())
                        .recalled(recalled);

        if (redact || recalled) {
            return builder.reactions(List.of()).build();
        }

        if (replyTarget != null) {
            boolean replyRecalled = replyTarget.getRecalledAt() != null;
            builder.replyTo(
                    MessageReplyResource.builder()
                            .id(replyTarget.getId())
                            .senderType(replyTarget.getSenderType())
                            .senderId(replyTarget.getSenderId())
                            .senderName(
                                    resolveActorName(
                                            replyTarget.getSenderType(),
                                            replyTarget.getSenderId(),
                                            connection,
                                            recruiterNames))
                            .messageType(replyTarget.getMessageType())
                            .body(replyRecalled ? null : truncate(replyTarget.getBody()))
                            .attachmentFileName(
                                    replyRecalled ? null : replyTarget.getAttachmentFileName())
                            .recalled(replyRecalled)
                            .build());
        }

        List<MessageReactionResource> reactions =
                toReactionResources(reactionEntities, connection, recruiterNames);

        return builder.body(message.getBody())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentFileName(message.getAttachmentFileName())
                .attachmentContentType(message.getAttachmentContentType())
                .attachmentFileSizeBytes(message.getAttachmentFileSizeBytes())
                .linkUrl(message.getLinkUrl())
                .linkTitle(message.getLinkTitle())
                .linkDescription(message.getLinkDescription())
                .linkImageUrl(message.getLinkImageUrl())
                .reactions(reactions)
                .build();
    }

    public List<MessageReactionResource> toReactionResources(
            List<ConnectionMessageReaction> reactionEntities,
            Connection connection,
            Map<Long, String> recruiterNames) {
        if (reactionEntities == null || reactionEntities.isEmpty()) {
            return List.of();
        }
        return reactionEntities.stream()
                .map(
                        reaction ->
                                MessageReactionResource.builder()
                                        .actorType(reaction.getActorType())
                                        .actorId(reaction.getActorId())
                                        .actorName(
                                                resolveActorName(
                                                        reaction.getActorType(),
                                                        reaction.getActorId(),
                                                        connection,
                                                        recruiterNames))
                                        .emoji(reaction.getEmoji())
                                        .build())
                .toList();
    }

    public String resolveActorName(
            ConnectActorType actorType,
            Long actorId,
            Connection connection,
            Map<Long, String> recruiterNames) {
        if (actorType == ConnectActorType.CANDIDATE) {
            return connection != null ? connection.getCandidateName() : "Candidate";
        }
        String resolved = recruiterNames != null ? recruiterNames.get(actorId) : null;
        if (resolved != null && !resolved.isBlank()) {
            return resolved;
        }
        return connection != null ? connection.getCompanyName() : "Recruiter";
    }

    public ConnectFilterWordResource toFilterWordResource(ConnectFilterWord entity) {
        if (entity == null) {
            return null;
        }
        return ConnectFilterWordResource.builder()
                .id(entity.getId())
                .pattern(entity.getPattern())
                .regex(entity.isRegex())
                .severity(entity.getSeverity())
                .active(entity.isActive())
                .note(entity.getNote())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
