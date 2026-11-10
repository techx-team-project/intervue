package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.resources.ConnectRulesAckResource;

public interface ConnectRulesAckServiceInterface {

    ConnectRulesAckResource get(ConnectActorType actorType, Long actorId);

    ConnectRulesAckResource acknowledge(ConnectActorType actorType, Long actorId);
}
