package com.techx.intervue.modules.connect.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectMessageType;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessageReplyResource(
        Long id,
        ConnectActorType senderType,
        Long senderId,
        String senderName,
        ConnectMessageType messageType,
        String body,
        String attachmentFileName,
        boolean recalled) {}
