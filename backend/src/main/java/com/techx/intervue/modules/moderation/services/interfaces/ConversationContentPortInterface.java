package com.techx.intervue.modules.moderation.services.interfaces;

/**
 * Implemented by the connect module so moderation can hide a conversation's content without
 * importing connect internals.
 */
public interface ConversationContentPortInterface {

    void hideContent(Long connectionId);
}
