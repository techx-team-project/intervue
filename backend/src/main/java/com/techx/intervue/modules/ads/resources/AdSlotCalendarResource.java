package com.techx.intervue.modules.ads.resources;

import java.util.List;
import lombok.Builder;

@Builder
public record AdSlotCalendarResource(AdSlotResource slot, List<AdWeekResource> weeks) {}
