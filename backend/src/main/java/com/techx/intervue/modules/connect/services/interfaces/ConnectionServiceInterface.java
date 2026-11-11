package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.UnsendScope;
import com.techx.intervue.modules.connect.requests.EditMessageRequest;
import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.requests.SendMessageRequest;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageReactionResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ConnectionServiceInterface {

    record AttachmentContent(String fileName, String contentType, byte[] bytes) {}

    InvitationResource invite(Long recruiterId, SendInvitationRequest request);

    void accept(Long candidateId, Long connectionId);

    void decline(Long candidateId, Long connectionId);

    Page<ConversationSummaryResource> candidateInvitations(Long candidateId, Pageable pageable);

    long countPendingInvitations(Long candidateId);

    Page<ConversationSummaryResource> candidateConversations(Long candidateId, Pageable pageable);

    Page<EligibleCandidateResource> eligibleCandidates(
            Long recruiterId, String search, Pageable pageable);

    Page<ConversationSummaryResource> recruiterConversations(Long recruiterId, Pageable pageable);

    ConversationSummaryResource getConversation(
            ConnectActorType actorType, Long actorId, Long connectionId);

    ConversationSummaryResource getConversationByIdentifier(
            ConnectActorType actorType, Long actorId, String identifier);

    MessageResource sendMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            SendMessageRequest request);

    MessageResource sendAttachment(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            MultipartFile file,
            String caption,
            String clientMessageId,
            Long replyToMessageId);

    MessageResource editMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long messageId,
            EditMessageRequest request);

    MessageResource unsendMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long messageId,
            UnsendScope scope);

    List<MessageReactionResource> reactToMessage(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long messageId,
            String emoji);

    void markAsRead(
            ConnectActorType actorType, Long actorId, Long connectionId, Long lastReadMessageId);

    void sendTyping(ConnectActorType actorType, Long actorId, Long connectionId, boolean typing);

    Page<MessageResource> listMessages(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            Long beforeId,
            Pageable pageable);

    Page<MessageResource> adminListMessages(Long connectionId, Pageable pageable);

    void block(ConnectActorType actorType, Long actorId, Long connectionId);

    void unblock(ConnectActorType actorType, Long actorId, Long connectionId);

    AttachmentContent downloadAttachment(
            ConnectActorType actorType, Long actorId, Long connectionId, Long messageId);

    void report(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            ReportReasonCode reasonCode,
            String reasonNote);
}
