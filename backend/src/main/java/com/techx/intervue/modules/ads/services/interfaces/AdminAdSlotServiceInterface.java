package com.techx.intervue.modules.ads.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.ads.requests.CreateAdSlotRequest;
import com.techx.intervue.modules.ads.requests.SaveAdSlotRequest;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import java.util.List;

public interface AdminAdSlotServiceInterface {

    List<AdSlotResource> list();

    AdSlotResource create(CreateAdSlotRequest request, RequestActor actor);

    AdSlotResource update(Long id, SaveAdSlotRequest request, RequestActor actor);
}
