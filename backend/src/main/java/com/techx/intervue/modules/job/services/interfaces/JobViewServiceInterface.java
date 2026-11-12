package com.techx.intervue.modules.job.services.interfaces;

public interface JobViewServiceInterface {

    void record(Long jobId, String clientIp);

    /** Views counted today that the flush has not moved into the daily table yet. */
    int pendingViews(Long jobId);
}
