package com.techx.intervue.modules.moderation.services.interfaces;

import java.util.Optional;

/**
 * Implemented by the connect module so moderation can hide a conversation's content without
 * importing connect internals.
 */
public interface ConversationContentPortInterface {

    record ConversationParticipants(Long candidateId, Long initiatedByRecruiterId) {}

    void hideContent(Long connectionId);

    Optional<ConversationParticipants> findParticipants(Long connectionId);
}
