package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;

public interface AiGatewayServiceInterface {

    AiChatResult chat(AiCallContext context, AiChatRequest request);

    EmbeddingResult embed(AiCallContext context, EmbeddingRequest request);
}
