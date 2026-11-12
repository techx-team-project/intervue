package com.techx.intervue.modules.moderation.services.interfaces;

import com.techx.intervue.common.web.RequestActor;

public interface JobContentPortInterface {

    void hideJob(Long jobId, String reason, RequestActor actor);
}
