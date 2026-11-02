package com.techx.intervue.common.audit.repositories;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import java.util.Collection;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {

    Page<AuditLog> findByTargetTypeAndTargetId(
            AuditTargetType targetType, Long targetId, Pageable pageable);

    @Query(
            """
                SELECT DISTINCT a.targetId FROM AuditLog a
                WHERE a.targetType = :targetType AND a.targetId IN :targetIds AND a.action = :action
            """)
    Set<Long> findTargetIdsByTargetTypeAndTargetIdInAndAction(
            @Param("targetType") AuditTargetType targetType,
            @Param("targetIds") Collection<Long> targetIds,
            @Param("action") AuditAction action);

    boolean existsByTargetTypeAndTargetIdAndAction(
            AuditTargetType targetType, Long targetId, AuditAction action);
}
