package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.util.Map;

public interface ConnectUnreadServiceInterface {

    void increment(ConnectActorType actorType, Long actorId, Long connectionId);

    void clear(ConnectActorType actorType, Long actorId, Long connectionId);

    long total(ConnectActorType actorType, Long actorId);

    Map<Long, Long> breakdown(ConnectActorType actorType, Long actorId);
}
