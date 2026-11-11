package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectionMessageReaction;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionMessageReactionRepository
        extends JpaRepository<ConnectionMessageReaction, Long> {

    List<ConnectionMessageReaction> findByMessageIdInOrderByIdAsc(Collection<Long> messageIds);

    List<ConnectionMessageReaction> findByMessageIdOrderByIdAsc(Long messageId);

    Optional<ConnectionMessageReaction> findByMessageIdAndActorTypeAndActorId(
            Long messageId, ConnectActorType actorType, Long actorId);
}
