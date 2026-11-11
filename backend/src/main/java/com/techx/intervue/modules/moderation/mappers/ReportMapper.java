package com.techx.intervue.modules.moderation.mappers;

import com.techx.intervue.modules.moderation.entities.Report;
import com.techx.intervue.modules.moderation.resources.AdminReportDetailResource;
import com.techx.intervue.modules.moderation.resources.AdminReportSummaryResource;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public AdminReportSummaryResource toSummary(Report report) {
        return AdminReportSummaryResource.builder()
                .id(report.getId())
                .reporterType(report.getReporterType())
                .reporterId(report.getReporterId())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reasonCode(report.getReasonCode())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }

    public AdminReportDetailResource toDetail(Report report) {
        return AdminReportDetailResource.builder()
                .id(report.getId())
                .reporterType(report.getReporterType())
                .reporterId(report.getReporterId())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reasonCode(report.getReasonCode())
                .reasonNote(report.getReasonNote())
                .status(report.getStatus())
                .adminNote(report.getAdminNote())
                .reviewedByUserId(report.getReviewedByUserId())
                .reviewedAt(report.getReviewedAt())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
