package com.techx.intervue.modules.billing.mappers;

import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.resources.CartItemResource;
import org.springframework.stereotype.Component;

@Component
public class CartMapper {

    public CartItemResource toResource(CartItem item) {
        ServicePackage servicePackage = item.getServicePackage();
        return new CartItemResource(
                item.getId(),
                servicePackage.getId(),
                servicePackage.getCode(),
                servicePackage.getSlug(),
                servicePackage.getName(),
                servicePackage.getShortDescription(),
                servicePackage.getPrice(),
                servicePackage.getCurrency(),
                item.getQuantity(),
                servicePackage.getPrice() * item.getQuantity(),
                servicePackage.getValidityDays(),
                servicePackage.getOneTimePerCompany());
    }
}
