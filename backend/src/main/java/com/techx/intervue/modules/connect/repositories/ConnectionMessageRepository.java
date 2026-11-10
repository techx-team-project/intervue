package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionMessageRepository extends JpaRepository<ConnectionMessage, Long> {

    Page<ConnectionMessage> findByConnectionId(Long connectionId, Pageable pageable);

    Optional<ConnectionMessage> findByIdAndConnectionId(Long id, Long connectionId);
}
