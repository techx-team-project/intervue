package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.modules.ai.requests.ProviderPayload;

public record GeminiMessagePayload(GeminiMessageMapper.GeminiContent content)
        implements ProviderPayload {}
