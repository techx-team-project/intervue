package com.techx.intervue.modules.ads.services.interfaces;

import com.techx.intervue.modules.ads.resources.AdSlotCalendarResource;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import java.util.List;

public interface AdSlotServiceInterface {

    List<AdSlotResource> listActive();

    AdSlotCalendarResource calendar(String code, int weeksAhead, Long companyId);
}
