package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.repositories.CartItemRepository;
import com.techx.intervue.modules.billing.repositories.CartRepository;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartLineReader {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public List<CartItem> read(Long recruiterId, Collection<Long> itemIds) {
        return cartRepository
                .findByRecruiterId(recruiterId)
                .map(
                        cart ->
                                filter(
                                        cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(
                                                cart.getId()),
                                        itemIds))
                .orElseGet(List::of);
    }

    private List<CartItem> filter(List<CartItem> items, Collection<Long> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) {
            return items;
        }
        Set<Long> wanted = Set.copyOf(itemIds);
        return items.stream().filter(item -> wanted.contains(item.getId())).toList();
    }
}
