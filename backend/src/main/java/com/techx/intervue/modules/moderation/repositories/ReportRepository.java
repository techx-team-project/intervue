package com.techx.intervue.modules.moderation.repositories;

import com.techx.intervue.modules.moderation.entities.Report;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository
        extends JpaRepository<Report, Long>, JpaSpecificationExecutor<Report> {

    long countByTargetTypeAndTargetIdAndStatus(
            ReportTargetType targetType, Long targetId, ReportStatus status);

    boolean existsByTargetTypeAndTargetIdAndReporterTypeAndReporterIdAndStatus(
            ReportTargetType targetType,
            Long targetId,
            ReporterType reporterType,
            Long reporterId,
            ReportStatus status);

    boolean existsByTargetTypeAndTargetIdAndReporterTypeAndReporterIdIsNullAndStatus(
            ReportTargetType targetType,
            Long targetId,
            ReporterType reporterType,
            ReportStatus status);

    @Query(
            """
                SELECT r.targetId AS targetId, COUNT(r) AS total FROM Report r
                WHERE r.targetType = :targetType AND r.status = :status
                GROUP BY r.targetId ORDER BY COUNT(r) DESC, r.targetId ASC
            """)
    List<TargetCount> countPendingByTarget(
            @Param("targetType") ReportTargetType targetType,
            @Param("status") ReportStatus status,
            Pageable pageable);

    interface TargetCount {
        Long getTargetId();

        long getTotal();
    }
}
