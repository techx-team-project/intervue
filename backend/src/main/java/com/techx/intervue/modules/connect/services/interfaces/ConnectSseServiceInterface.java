package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import com.techx.intervue.modules.connect.resources.MessageResource;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface ConnectSseServiceInterface {

    SseEmitter subscribe(ConnectActorType actorType, Long actorId);

    void publish(ConnectActorType actorType, Long actorId, MessageResource message);

    void publishStatus(
            ConnectActorType actorType, Long actorId, Long connectionId, ConnectionStatus status);
}
