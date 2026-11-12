package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.text.Texts;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.requests.ReportJobRequest;
import com.techx.intervue.modules.job.services.interfaces.JobReportServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobReportService implements JobReportServiceInterface {

    private final PublicJobServiceInterface publicJobService;
    private final ReportServiceInterface reportService;

    @Override
    public void report(Long jobId, Long candidateId, ReportJobRequest request) {
        publicJobService.findOne(jobId);
        if (reportService.existsPending(
                ReportTargetType.JOB_POST, jobId, ReporterType.CANDIDATE, candidateId)) {
            throw new AppException(ErrorCode.REPORT_ALREADY_FILED);
        }
        reportService.file(
                ReporterType.CANDIDATE,
                candidateId,
                ReportTargetType.JOB_POST,
                jobId,
                request.reasonCode(),
                Texts.blankToNull(request.note()));
    }
}
