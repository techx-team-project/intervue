package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.requests.AddCartItemRequest;
import com.techx.intervue.modules.billing.requests.UpdateCartItemRequest;
import com.techx.intervue.modules.billing.resources.CartResource;

public interface CartServiceInterface {

    CartResource getCart(Long recruiterId);

    CartResource addItem(AddCartItemRequest request, Long recruiterId);

    CartResource updateItem(Long itemId, UpdateCartItemRequest request, Long recruiterId);

    CartResource removeItem(Long itemId, Long recruiterId);

    CartResource clear(Long recruiterId);
}
