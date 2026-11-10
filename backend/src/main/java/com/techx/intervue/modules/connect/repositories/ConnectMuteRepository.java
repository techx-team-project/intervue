package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectMute;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectMuteRepository extends JpaRepository<ConnectMute, Long> {

    Optional<ConnectMute>
            findFirstByActorTypeAndActorIdAndLiftedAtIsNullAndExpiresAtAfterOrderByExpiresAtDesc(
                    ConnectActorType actorType, Long actorId, Instant now);

    Optional<ConnectMute>
            findFirstByActorTypeAndActorIdAndLiftedAtIsNullAndCreatedAtAfterOrderByCreatedAtDesc(
                    ConnectActorType actorType, Long actorId, Instant createdAfter);
}
