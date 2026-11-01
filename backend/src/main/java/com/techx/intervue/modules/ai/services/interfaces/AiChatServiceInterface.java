package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.UserChatRequest;
import com.techx.intervue.modules.ai.resources.UserChatResponse;

public interface AiChatServiceInterface {

    UserChatResponse chat(Long userId, String ip, UserChatRequest request);
}
