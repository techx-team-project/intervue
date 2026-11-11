package com.techx.intervue.modules.connect.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectMessageType;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessageResource(
        Long id,
        Long connectionId,
        ConnectActorType senderType,
        Long senderId,
        String senderName,
        String clientMessageId,
        Long replyToMessageId,
        MessageReplyResource replyTo,
        ConnectMessageType messageType,
        String body,
        String attachmentUrl,
        String attachmentFileName,
        String attachmentContentType,
        Long attachmentFileSizeBytes,
        String linkUrl,
        String linkTitle,
        String linkDescription,
        String linkImageUrl,
        Instant createdAt,
        Instant editedAt,
        boolean recalled,
        List<MessageReactionResource> reactions) {}
