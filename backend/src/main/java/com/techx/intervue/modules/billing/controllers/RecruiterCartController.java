package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.AddCartItemRequest;
import com.techx.intervue.modules.billing.requests.UpdateCartItemRequest;
import com.techx.intervue.modules.billing.resources.CartResource;
import com.techx.intervue.modules.billing.services.interfaces.CartServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterCartController extends BaseController {

    private final CartServiceInterface cartService;

    @GetMapping
    public ResponseEntity<ApiResource<CartResource>> cart(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(cartService.getCart(principal.getId()), "Cart retrieved successfully!");
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResource<CartResource>> addItem(
            @Valid @RequestBody AddCartItemRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(cartService.addItem(request, principal.getId()), "Added to cart!");
    }

    @PatchMapping("/items/{id}")
    public ResponseEntity<ApiResource<CartResource>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(cartService.updateItem(id, request, principal.getId()), "Cart updated!");
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResource<CartResource>> removeItem(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(cartService.removeItem(id, principal.getId()), "Removed from cart!");
    }

    @DeleteMapping
    public ResponseEntity<ApiResource<CartResource>> clear(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(cartService.clear(principal.getId()), "Cart cleared!");
    }
}
