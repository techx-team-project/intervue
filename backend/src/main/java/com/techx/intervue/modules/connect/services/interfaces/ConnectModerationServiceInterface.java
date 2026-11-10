package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectActorType;

public interface ConnectModerationServiceInterface {

    void screen(ConnectActorType actorType, Long actorId, Long connectionId, String text);

    boolean isMuted(ConnectActorType actorType, Long actorId);
}
