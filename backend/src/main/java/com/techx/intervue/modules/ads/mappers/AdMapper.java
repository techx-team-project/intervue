package com.techx.intervue.modules.ads.mappers;

import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import org.springframework.stereotype.Component;

@Component
public class AdMapper {

    public AdSlotResource toSlotResource(AdSlot slot, String packageSlug) {
        return AdSlotResource.builder()
                .id(slot.getId())
                .code(slot.getCode())
                .name(slot.getName())
                .placement(slot.getPlacement())
                .description(slot.getDescription())
                .width(slot.getWidth())
                .height(slot.getHeight())
                .pricePerWeek(slot.getPricePerWeek())
                .packageSlug(packageSlug)
                .houseImageUrl(slot.getHouseImageUrl())
                .houseTargetUrl(slot.getHouseTargetUrl())
                .displayOrder(slot.getDisplayOrder())
                .active(Boolean.TRUE.equals(slot.getIsActive()))
                .build();
    }
}
