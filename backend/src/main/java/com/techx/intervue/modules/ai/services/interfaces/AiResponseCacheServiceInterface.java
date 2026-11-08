package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.UserChatResponse;
import java.util.Optional;

public interface AiResponseCacheServiceInterface {

    Optional<UserChatResponse> get(String message, int remainingQuota);

    void put(
            String message,
            UserChatResponse response,
            boolean containsPrivateData,
            boolean containsJobData);

    boolean isLikelyPrivate(String message);
}
