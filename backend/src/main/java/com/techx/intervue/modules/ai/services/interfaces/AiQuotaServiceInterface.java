package com.techx.intervue.modules.ai.services.interfaces;

public interface AiQuotaServiceInterface {

    void reserve(Long userId, String ip);

    void release(Long userId, String ip);

    int getRemaining(Long userId, String ip);
}
