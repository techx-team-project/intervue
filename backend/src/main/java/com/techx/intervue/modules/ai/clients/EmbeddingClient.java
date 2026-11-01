package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;

public interface EmbeddingClient {

    String model();

    EmbeddingResult embed(EmbeddingRequest request);
}
