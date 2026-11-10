package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConnectionServiceInterface {

    InvitationResource invite(Long recruiterId, SendInvitationRequest request);

    void accept(Long candidateId, Long connectionId);

    void decline(Long candidateId, Long connectionId);

    Page<ConversationSummaryResource> candidateInvitations(Long candidateId, Pageable pageable);

    Page<ConversationSummaryResource> candidateConversations(Long candidateId, Pageable pageable);

    Page<EligibleCandidateResource> eligibleCandidates(
            Long recruiterId, String search, Pageable pageable);

    Page<ConversationSummaryResource> recruiterConversations(Long recruiterId, Pageable pageable);
}
