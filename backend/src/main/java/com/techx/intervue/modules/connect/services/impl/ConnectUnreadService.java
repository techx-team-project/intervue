package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.services.interfaces.ConnectUnreadServiceInterface;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectUnreadService implements ConnectUnreadServiceInterface {

    private static final String PREFIX = "connect:unread:";

    private final StringRedisTemplate redis;

    @Override
    public void increment(ConnectActorType actorType, Long actorId, Long connectionId) {
        ops().increment(key(actorType, actorId), String.valueOf(connectionId), 1);
    }

    @Override
    public void clear(ConnectActorType actorType, Long actorId, Long connectionId) {
        ops().delete(key(actorType, actorId), String.valueOf(connectionId));
    }

    @Override
    public long total(ConnectActorType actorType, Long actorId) {
        Collection<String> values = ops().values(key(actorType, actorId));
        return values.stream().mapToLong(Long::parseLong).sum();
    }

    private HashOperations<String, String, String> ops() {
        return redis.opsForHash();
    }

    private String key(ConnectActorType actorType, Long actorId) {
        return PREFIX + actorType + ":" + actorId;
    }
}
