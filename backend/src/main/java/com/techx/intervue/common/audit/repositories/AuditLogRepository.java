package com.techx.intervue.common.audit.repositories;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {

    Page<AuditLog> findByTargetTypeAndTargetId(
            AuditTargetType targetType, Long targetId, Pageable pageable);
}
