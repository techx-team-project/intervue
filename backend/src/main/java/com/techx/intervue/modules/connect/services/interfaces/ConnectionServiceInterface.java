package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.requests.SendMessageRequest;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ConnectionServiceInterface {

    record AttachmentContent(String fileName, String contentType, byte[] bytes) {}

    InvitationResource invite(Long recruiterId, SendInvitationRequest request);

    void accept(Long candidateId, Long connectionId);

    void decline(Long candidateId, Long connectionId);

    Page<ConversationSummaryResource> candidateInvitations(Long candidateId, Pageable pageable);

    Page<ConversationSummaryResource> candidateConversations(Long candidateId, Pageable pageable);

    Page<EligibleCandidateResource> eligibleCandidates(
            Long recruiterId, String search, Pageable pageable);

    Page<ConversationSummaryResource> recruiterConversations(Long recruiterId, Pageable pageable);

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
            String caption);

    Page<MessageResource> listMessages(
            ConnectActorType actorType, Long actorId, Long connectionId, Pageable pageable);

    void block(ConnectActorType actorType, Long actorId, Long connectionId);

    AttachmentContent downloadAttachment(
            ConnectActorType actorType, Long actorId, Long connectionId, Long messageId);

    void report(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            ReportReasonCode reasonCode,
            String reasonNote);
}
