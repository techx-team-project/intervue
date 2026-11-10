package com.techx.intervue.modules.connect.mappers;

import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import org.springframework.stereotype.Component;

@Component
public class ConnectMapper {

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
        return ConversationSummaryResource.builder()
                .id(connection.getId())
                .status(connection.getStatus())
                .companyId(connection.getCompanyId())
                .companyName(connection.getCompanyName())
                .candidateId(connection.getCandidateId())
                .candidateName(connection.getCandidateName())
                .invitedAt(connection.getInvitedAt())
                .respondedAt(connection.getRespondedAt())
                .build();
    }

    public MessageResource toMessage(ConnectionMessage message) {
        return MessageResource.builder()
                .id(message.getId())
                .connectionId(message.getConnectionId())
                .senderType(message.getSenderType())
                .senderId(message.getSenderId())
                .messageType(message.getMessageType())
                .body(message.getBody())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentFileName(message.getAttachmentFileName())
                .attachmentContentType(message.getAttachmentContentType())
                .attachmentFileSizeBytes(message.getAttachmentFileSizeBytes())
                .linkUrl(message.getLinkUrl())
                .linkTitle(message.getLinkTitle())
                .linkDescription(message.getLinkDescription())
                .linkImageUrl(message.getLinkImageUrl())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
