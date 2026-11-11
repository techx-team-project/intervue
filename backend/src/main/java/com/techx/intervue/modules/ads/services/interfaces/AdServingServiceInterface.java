package com.techx.intervue.modules.ads.services.interfaces;

import com.techx.intervue.modules.ads.resources.ServedAdResource;
import java.util.Optional;

public interface AdServingServiceInterface {

    Optional<ServedAdResource> serve(String slotCode);

    void recordClick(String slotCode, String clientIp);
}
