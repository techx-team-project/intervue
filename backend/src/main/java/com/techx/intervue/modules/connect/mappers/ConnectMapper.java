package com.techx.intervue.modules.connect.mappers;

import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
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
}
