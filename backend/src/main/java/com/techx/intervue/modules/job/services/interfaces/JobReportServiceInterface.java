package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.requests.ReportJobRequest;

public interface JobReportServiceInterface {

    void report(Long jobId, Long candidateId, ReportJobRequest request);
}
