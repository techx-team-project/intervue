package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.services.interfaces.ConnectSseServiceInterface;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
public class ConnectSseService implements ConnectSseServiceInterface {

    private static final long HEARTBEAT_MS = 20_000;

    // In-memory on purpose: this holds only for the current app instance. Fan-out across multiple
    // instances would need Redis pub/sub - not needed for the current single-instance deployment.
    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    @Override
    public SseEmitter subscribe(ConnectActorType actorType, Long actorId) {
        SseEmitter emitter = new SseEmitter(0L);
        String key = key(actorType, actorId);
        emitters.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> remove(key, emitter));
        emitter.onTimeout(() -> remove(key, emitter));
        emitter.onError(ex -> remove(key, emitter));
        return emitter;
    }

    @Override
    public void publishEvent(
            ConnectActorType actorType, Long actorId, String eventName, Object payload) {
        String targetKey = key(actorType, actorId);
        List<SseEmitter> list = emitters.get(targetKey);
        if (list == null) {
            return;
        }
        for (SseEmitter emitter : list) {
            send(targetKey, emitter, SseEmitter.event().name(eventName).data(payload));
        }
    }

    @Scheduled(fixedRate = HEARTBEAT_MS)
    public void heartbeat() {
        emitters.forEach(
                (key, list) -> {
                    for (SseEmitter emitter : list) {
                        send(key, emitter, SseEmitter.event().comment("ping"));
                    }
                });
    }

    private void send(String key, SseEmitter emitter, SseEmitter.SseEventBuilder event) {
        try {
            emitter.send(event);
        } catch (IOException | IllegalStateException e) {
            remove(key, emitter);
        }
    }

    private void remove(String key, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(key);
        if (list != null) {
            list.remove(emitter);
        }
    }

    private String key(ConnectActorType actorType, Long actorId) {
        return actorType.name() + ":" + actorId;
    }
}
