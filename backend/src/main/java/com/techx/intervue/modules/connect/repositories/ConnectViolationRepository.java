package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectViolation;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectViolationRepository extends JpaRepository<ConnectViolation, Long> {

    long countByActorTypeAndActorIdAndSeverityAndCreatedAtAfter(
            ConnectActorType actorType,
            Long actorId,
            ConnectFilterSeverity severity,
            Instant createdAfter);
}
