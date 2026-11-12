package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.entities.Cart;
import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.mappers.CartMapper;
import com.techx.intervue.modules.billing.repositories.CartItemRepository;
import com.techx.intervue.modules.billing.repositories.CartRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.requests.AddCartItemRequest;
import com.techx.intervue.modules.billing.requests.UpdateCartItemRequest;
import com.techx.intervue.modules.billing.resources.CartItemResource;
import com.techx.intervue.modules.billing.resources.CartResource;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.CartServiceInterface;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService implements CartServiceInterface {

    private static final int MAX_DISTINCT_ITEMS = 20;

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AdCartMeta adCartMeta;
    private final AdBookingServiceInterface adBookingService;
    private final ServicePackageRepository packageRepository;
    private final CartMapper cartMapper;
    private final OrderPricing orderPricing;
    private final BillingSettingsServiceInterface billingSettings;

    @Override
    @Transactional
    public CartResource getCart(Long recruiterId) {
        return toResource(requireCart(recruiterId));
    }

    @Override
    @Transactional
    public CartResource addItem(AddCartItemRequest request, Long recruiterId) {
        Cart cart = requireCart(recruiterId);
        ServicePackage servicePackage = requireActivePackage(request.packageId());

        String metaJson = adCartMeta.build(servicePackage, request.weeks(), request.quantity());

        CartItem existing =
                cartItemRepository
                        .findByCartIdAndServicePackageId(cart.getId(), servicePackage.getId())
                        .orElse(null);
        if (existing != null && metaJson == null) {
            existing.setQuantity(Math.min(99, existing.getQuantity() + request.quantity()));
            return toResource(cart);
        }
        // Banner weeks accumulate: a second pick adds to the weeks already chosen, deduped
        if (existing != null) {
            List<LocalDate> combined =
                    new ArrayList<>(adCartMeta.readWeeks(existing.getMetaJson()));
            combined.addAll(request.weeks());
            List<LocalDate> merged = combined.stream().distinct().sorted().toList();
            adBookingService.assertWeeksAvailable(servicePackage.getId(), merged);
            existing.setMetaJson(adCartMeta.build(servicePackage, merged, merged.size()));
            existing.setQuantity(merged.size());
            return toResource(cart);
        }
        if (metaJson != null) {
            adBookingService.assertWeeksAvailable(servicePackage.getId(), request.weeks());
        }

        if (cartItemRepository.countByCartId(cart.getId()) >= MAX_DISTINCT_ITEMS) {
            throw new AppException(ErrorCode.CART_ITEM_LIMIT_EXCEEDED);
        }
        cartItemRepository.save(
                CartItem.builder()
                        .cart(cart)
                        .servicePackage(servicePackage)
                        .quantity(request.quantity())
                        .metaJson(metaJson)
                        .build());
        return toResource(cart);
    }

    @Override
    @Transactional
    public CartResource updateItem(Long itemId, UpdateCartItemRequest request, Long recruiterId) {
        Cart cart = requireCart(recruiterId);
        CartItem item =
                cartItemRepository
                        .findByIdAndCartId(itemId, cart.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!item.getServicePackage().isAvailableInCatalog()) {
            throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
        }
        if (!adCartMeta.readWeeks(item.getMetaJson()).isEmpty()
                || adCartMeta.isAdPackage(item.getServicePackage().getId())) {
            throw new AppException(ErrorCode.AD_BANNER_QUANTITY_LOCKED);
        }
        item.setQuantity(request.quantity());
        return toResource(cart);
    }

    @Override
    @Transactional
    public CartResource removeItem(Long itemId, Long recruiterId) {
        Cart cart = requireCart(recruiterId);
        CartItem item =
                cartItemRepository
                        .findByIdAndCartId(itemId, cart.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        cartItemRepository.delete(item);
        cartItemRepository.flush();
        return toResource(cart);
    }

    @Override
    @Transactional
    public CartResource clear(Long recruiterId) {
        Cart cart = requireCart(recruiterId);
        cartItemRepository.deleteByCartId(cart.getId());
        cartItemRepository.flush();
        return toResource(cart);
    }

    private Cart requireCart(Long recruiterId) {
        return cartRepository
                .findByRecruiterId(recruiterId)
                .orElseGet(
                        () -> cartRepository.save(Cart.builder().recruiterId(recruiterId).build()));
    }

    private ServicePackage requireActivePackage(Long packageId) {
        ServicePackage servicePackage =
                packageRepository
                        .findById(packageId)
                        .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
        if (!servicePackage.isAvailableInCatalog()) {
            throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
        }
        return servicePackage;
    }

    private CartResource toResource(Cart cart) {
        List<CartItem> items = cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(cart.getId());
        List<CartItemResource> resources = items.stream().map(cartMapper::toResource).toList();
        long subtotal = resources.stream().mapToLong(CartItemResource::lineTotal).sum();

        BillingSettings settings = billingSettings.current();
        OrderPricing.Totals totals = orderPricing.compute(subtotal, 0L, settings.getVatRate());
        String currency = resources.isEmpty() ? "VND" : resources.getFirst().currency();

        return new CartResource(
                resources,
                totals.subtotal(),
                settings.getVatRate(),
                totals.vatAmount(),
                totals.totalAmount(),
                currency);
    }
}
