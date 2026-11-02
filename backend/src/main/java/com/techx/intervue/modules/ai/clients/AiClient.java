package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;

public interface AiClient {

    String model();

    AiChatResult chat(AiChatRequest request);
}
