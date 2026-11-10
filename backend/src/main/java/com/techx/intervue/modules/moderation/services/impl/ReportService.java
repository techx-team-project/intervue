package com.techx.intervue.modules.moderation.services.impl;

import com.techx.intervue.modules.moderation.entities.Report;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.repositories.ReportRepository;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService implements ReportServiceInterface {

    private final ReportRepository reportRepository;

    @Override
    @Transactional
    public void file(
            ReporterType reporterType,
            Long reporterId,
            ReportTargetType targetType,
            Long targetId,
            ReportReasonCode reasonCode,
            String reasonNote) {
        reportRepository.save(
                Report.builder()
                        .reporterType(reporterType)
                        .reporterId(reporterId)
                        .targetType(targetType)
                        .targetId(targetId)
                        .reasonCode(reasonCode)
                        .reasonNote(reasonNote)
                        .status(ReportStatus.PENDING)
                        .build());
    }
}
