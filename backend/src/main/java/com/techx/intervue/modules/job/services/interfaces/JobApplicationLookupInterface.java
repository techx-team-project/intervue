package com.techx.intervue.modules.job.services.interfaces;

import java.time.Instant;
import java.util.List;

public interface JobApplicationLookupInterface {

    boolean hasApplications(Long jobId);

    /** Submission times of the job's non-draft applications since the given instant. */
    List<Instant> submittedSince(Long jobId, Instant since);
}
