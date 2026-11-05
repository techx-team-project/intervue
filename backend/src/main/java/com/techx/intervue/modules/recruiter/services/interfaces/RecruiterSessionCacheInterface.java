package com.techx.intervue.modules.recruiter.services.interfaces;

import java.time.Duration;

public interface RecruiterSessionCacheInterface {

    record SessionData(String email, Integer tokenVersion) {}

    void set(Long recruiterId, String email, Duration ttl);

    void set(Long recruiterId, String email, Integer tokenVersion, Duration ttl);

    SessionData get(Long recruiterId);

    void evict(Long recruiterId);
}
