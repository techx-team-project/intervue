package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectRulesAcknowledgement;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectRulesAckRepository
        extends JpaRepository<ConnectRulesAcknowledgement, Long> {

    Optional<ConnectRulesAcknowledgement> findByActorTypeAndActorId(
            ConnectActorType actorType, Long actorId);
}
