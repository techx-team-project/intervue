package com.techx.intervue.modules.moderation.repositories;

import com.techx.intervue.modules.moderation.entities.Report;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository
        extends JpaRepository<Report, Long>, JpaSpecificationExecutor<Report> {

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
}
