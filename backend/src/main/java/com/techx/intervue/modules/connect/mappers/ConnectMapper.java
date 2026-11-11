package com.techx.intervue.modules.connect.mappers;

import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
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
        return toConversationSummary(connection, 0, null);
    }

    public ConversationSummaryResource toConversationSummary(
            Connection connection, long unreadCount, ConnectionMessage latestMessage) {
        return ConversationSummaryResource.builder()
                .id(connection.getId())
                .status(connection.getStatus())
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
                .build();
    }

    private String lastMessagePreview(Connection connection, ConnectionMessage message) {
        if (connection.getContentHiddenAt() != null) {
            return "Content has been hidden";
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
        return toMessage(message, false);
    }

    public MessageResource toMessage(ConnectionMessage message, boolean redact) {
        MessageResource.MessageResourceBuilder builder =
                MessageResource.builder()
                        .id(message.getId())
                        .connectionId(message.getConnectionId())
                        .senderType(message.getSenderType())
                        .senderId(message.getSenderId())
                        .messageType(message.getMessageType())
                        .createdAt(message.getCreatedAt());
        if (redact) {
            return builder.build();
        }
        return builder.body(message.getBody())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentFileName(message.getAttachmentFileName())
                .attachmentContentType(message.getAttachmentContentType())
                .attachmentFileSizeBytes(message.getAttachmentFileSizeBytes())
                .linkUrl(message.getLinkUrl())
                .linkTitle(message.getLinkTitle())
                .linkDescription(message.getLinkDescription())
                .linkImageUrl(message.getLinkImageUrl())
                .build();
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
