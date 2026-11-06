package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import java.util.List;

public interface CandidateApplicationServiceInterface {

    List<CandidateApplicationResult> getApplicationsByUserId(Long userId, int limit);
}
