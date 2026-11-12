package com.techx.intervue.modules.ai.services.interfaces;

public interface AiQuotaServiceInterface {

    void reserve(Long userId);

    void release(Long userId);
}
