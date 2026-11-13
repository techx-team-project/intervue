package com.techx.intervue.modules.billing.mappers;

import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.resources.CartItemResource;
import com.techx.intervue.modules.billing.services.impl.AdCartMeta;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartMapper {

    private final AdCartMeta adCartMeta;

    public CartItemResource toResource(CartItem item) {
        ServicePackage servicePackage = item.getServicePackage();
        List<LocalDate> weeks = adCartMeta.readWeeks(item.getMetaJson());
        boolean isAd = !weeks.isEmpty() || adCartMeta.isAdPackage(servicePackage.getId());
        return new CartItemResource(
                item.getId(),
                servicePackage.getId(),
                servicePackage.getSlug(),
                servicePackage.getName(),
                servicePackage.getShortDescription(),
                servicePackage.getPrice(),
                servicePackage.getCurrency(),
                item.getQuantity(),
                servicePackage.getPrice() * item.getQuantity(),
                servicePackage.getValidityDays(),
                servicePackage.getOneTimePerCompany(),
                isAd,
                weeks);
    }
}
