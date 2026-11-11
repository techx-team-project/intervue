package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionMessageRepository extends JpaRepository<ConnectionMessage, Long> {

    Page<ConnectionMessage> findByConnectionId(Long connectionId, Pageable pageable);

    Optional<ConnectionMessage> findByIdAndConnectionId(Long id, Long connectionId);

    Optional<ConnectionMessage> findFirstByConnectionIdOrderByCreatedAtDesc(Long connectionId);

    Optional<ConnectionMessage> findByConnectionIdAndSenderTypeAndSenderIdAndClientMessageId(
            Long connectionId, ConnectActorType senderType, Long senderId, String clientMessageId);

    @Query(
            """
            SELECT m FROM ConnectionMessage m
            WHERE m.connectionId = :connectionId
              AND NOT EXISTS (
                  SELECT 1 FROM ConnectionMessageHide h
                  WHERE h.messageId = m.id
                    AND h.actorType = :actorType
                    AND h.actorId = :actorId
              )
            ORDER BY m.id DESC
            """)
    List<ConnectionMessage> findLatestVisibleForActor(
            @Param("connectionId") Long connectionId,
            @Param("actorType") ConnectActorType actorType,
            @Param("actorId") Long actorId,
            Pageable pageable);

    @Query(
            """
            SELECT m FROM ConnectionMessage m
            WHERE m.connectionId = :connectionId
              AND (:beforeId IS NULL OR m.id < :beforeId)
              AND NOT EXISTS (
                  SELECT 1 FROM ConnectionMessageHide h
                  WHERE h.messageId = m.id
                    AND h.actorType = :actorType
                    AND h.actorId = :actorId
              )
            """)
    Page<ConnectionMessage> findVisiblePageForActor(
            @Param("connectionId") Long connectionId,
            @Param("beforeId") Long beforeId,
            @Param("actorType") ConnectActorType actorType,
            @Param("actorId") Long actorId,
            Pageable pageable);

    @Query(
            """
            SELECT m FROM ConnectionMessage m
            WHERE m.connectionId IN :connectionIds
              AND m.id = (
                  SELECT MAX(m2.id) FROM ConnectionMessage m2
                  WHERE m2.connectionId = m.connectionId
                    AND NOT EXISTS (
                        SELECT 1 FROM ConnectionMessageHide h
                        WHERE h.messageId = m2.id
                          AND h.actorType = :actorType
                          AND h.actorId = :actorId
                    )
              )
            """)
    List<ConnectionMessage> findLatestVisibleByConnectionIdsForActor(
            @Param("connectionIds") Collection<Long> connectionIds,
            @Param("actorType") ConnectActorType actorType,
            @Param("actorId") Long actorId);
}
