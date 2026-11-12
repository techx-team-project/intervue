package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.UserChatResponse;
import java.util.Optional;

public interface AiFaqServiceInterface {

    Optional<UserChatResponse> findByCode(String code);

    Optional<UserChatResponse> findSemanticMatch(String query, double minThreshold);

    void reloadCache();
}
