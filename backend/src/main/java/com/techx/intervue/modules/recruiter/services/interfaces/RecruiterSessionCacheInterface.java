package com.techx.intervue.modules.recruiter.services.interfaces;

import java.time.Duration;

public interface RecruiterSessionCacheInterface {

    record SessionData(String email) {}

    void set(Long recruiterId, String email, Duration ttl);

    SessionData get(Long recruiterId);

    void evict(Long recruiterId);
}
