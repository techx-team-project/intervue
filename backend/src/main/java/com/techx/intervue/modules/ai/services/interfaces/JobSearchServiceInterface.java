package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.JobSearchResult;
import java.util.List;

public interface JobSearchServiceInterface {

    List<JobSearchResult> search(
            String keyword, String level, String location, String sort, int limit);
}
