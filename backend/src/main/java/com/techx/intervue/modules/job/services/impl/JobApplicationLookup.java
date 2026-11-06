package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.job.services.interfaces.JobApplicationLookupInterface;
import org.springframework.stereotype.Component;

// Applications do not exist yet; the application module replaces this with a real query.
@Component
public class JobApplicationLookup implements JobApplicationLookupInterface {

    @Override
    public boolean hasApplications(Long jobId) {
        return false;
    }
}
