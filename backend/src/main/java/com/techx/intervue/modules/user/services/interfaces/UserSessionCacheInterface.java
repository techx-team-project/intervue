package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.RoleType;
import java.time.Duration;
import java.util.Set;

public interface UserSessionCacheInterface {

    record SessionData(String email, Set<RoleType> roles, Integer tokenVersion) {}

    void set(Long userId, String email, Set<RoleType> roles, Duration ttl);

    void set(Long userId, String email, Set<RoleType> roles, Integer tokenVersion, Duration ttl);

    SessionData get(Long userId);

    void evict(Long userId);
}
