package com.techx.intervue.modules.moderation.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportResolveAction;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.resources.AdminReportDetailResource;
import com.techx.intervue.modules.moderation.resources.AdminReportSummaryResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportServiceInterface {

    void file(
            ReporterType reporterType,
            Long reporterId,
            ReportTargetType targetType,
            Long targetId,
            ReportReasonCode reasonCode,
            String reasonNote);

    boolean existsPending(
            ReportTargetType targetType, Long targetId, ReporterType reporterType, Long reporterId);

    long countPending(ReportTargetType targetType, Long targetId);

    List<PendingTarget> mostReported(ReportTargetType targetType, int limit);

    record PendingTarget(Long targetId, long pendingReports) {}

    Page<AdminReportSummaryResource> search(
            ReportTargetType targetType, ReportStatus status, Pageable pageable);

    AdminReportDetailResource get(Long reportId);

    void dismiss(Long reportId, String note, RequestActor actor);

    void resolve(
            Long reportId,
            ReportResolveAction action,
            String note,
            ReporterType lockActorType,
            Long lockActorId,
            RequestActor actor);
}
