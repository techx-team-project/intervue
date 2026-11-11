package com.techx.intervue.modules.ai.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserChatRequest(
        @NotBlank(message = "Message must not be blank")
                @Size(max = 2000, message = "Message must not exceed 2000 characters")
                String message,
        String sessionId,
        String faqCode,
        ChatContext context) {

    public UserChatRequest(String message, String sessionId) {
        this(message, sessionId, null, null);
    }

    public UserChatRequest(String message, String sessionId, String faqCode) {
        this(message, sessionId, faqCode, null);
    }
}
