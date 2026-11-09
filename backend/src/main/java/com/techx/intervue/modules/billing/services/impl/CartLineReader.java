package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.repositories.CartItemRepository;
import com.techx.intervue.modules.billing.repositories.CartRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartLineReader {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public Map<ServicePackage, Integer> read(Long recruiterId) {
        Map<ServicePackage, Integer> lines = new LinkedHashMap<>();
        cartRepository
                .findByRecruiterId(recruiterId)
                .ifPresent(
                        cart -> {
                            List<CartItem> items =
                                    cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(
                                            cart.getId());
                            for (CartItem item : items) {
                                lines.put(item.getServicePackage(), item.getQuantity());
                            }
                        });
        return lines;
    }
}
