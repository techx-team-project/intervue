package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.modules.connect.entities.ConnectRulesAcknowledgement;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.repositories.ConnectRulesAckRepository;
import com.techx.intervue.modules.connect.resources.ConnectRulesAckResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectRulesAckServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConnectRulesAckService implements ConnectRulesAckServiceInterface {

    private final ConnectRulesAckRepository repository;

    @Override
    @Transactional(readOnly = true)
    public ConnectRulesAckResource get(ConnectActorType actorType, Long actorId) {
        return repository
                .findByActorTypeAndActorId(actorType, actorId)
                .map(ack -> new ConnectRulesAckResource(true, ack.getAcknowledgedAt()))
                .orElseGet(() -> new ConnectRulesAckResource(false, null));
    }

    @Override
    @Transactional
    public ConnectRulesAckResource acknowledge(ConnectActorType actorType, Long actorId) {
        ConnectRulesAcknowledgement ack =
                repository
                        .findByActorTypeAndActorId(actorType, actorId)
                        .orElseGet(
                                () ->
                                        ConnectRulesAcknowledgement.builder()
                                                .actorType(actorType)
                                                .actorId(actorId)
                                                .build());
        if (ack.getAcknowledgedAt() == null) {
            ack.setAcknowledgedAt(Instant.now());
            repository.save(ack);
        }
        return new ConnectRulesAckResource(true, ack.getAcknowledgedAt());
    }
}
