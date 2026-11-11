package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectionMessageHide;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionMessageHideRepository
        extends JpaRepository<ConnectionMessageHide, Long> {

    boolean existsByMessageIdAndActorTypeAndActorId(
            Long messageId, ConnectActorType actorType, Long actorId);

    List<ConnectionMessageHide> findByMessageIdInAndActorTypeAndActorId(
            Collection<Long> messageIds, ConnectActorType actorType, Long actorId);
}
