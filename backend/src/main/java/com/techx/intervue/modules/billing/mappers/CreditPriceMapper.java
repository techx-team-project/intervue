package com.techx.intervue.modules.billing.mappers;

import com.techx.intervue.modules.billing.entities.CreditPrice;
import com.techx.intervue.modules.billing.resources.CreditPriceResource;
import org.springframework.stereotype.Component;

@Component
public class CreditPriceMapper {

    public CreditPriceResource toResource(CreditPrice price) {
        return CreditPriceResource.builder()
                .id(price.getId())
                .entitlementType(price.getEntitlementType())
                .tier(price.getTier())
                .creditCost(price.getCreditCost())
                .durationDays(price.getDurationDays())
                .label(price.getLabel())
                .active(Boolean.TRUE.equals(price.getIsActive()))
                .displayOrder(price.getDisplayOrder())
                .build();
    }
}
