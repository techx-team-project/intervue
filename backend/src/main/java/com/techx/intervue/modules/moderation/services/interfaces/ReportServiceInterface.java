package com.techx.intervue.modules.moderation.services.interfaces;

import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;

public interface ReportServiceInterface {

    void file(
            ReporterType reporterType,
            Long reporterId,
            ReportTargetType targetType,
            Long targetId,
            ReportReasonCode reasonCode,
            String reasonNote);
}
