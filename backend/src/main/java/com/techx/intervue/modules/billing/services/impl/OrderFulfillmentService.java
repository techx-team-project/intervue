package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.mappers.OrderMapper;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.resources.ServicePackageBenefitResource;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.EntitlementGrant;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderFulfillmentService {

    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final EntitlementServiceInterface entitlementService;

    /**
     * Turns a paid order into company entitlements. Runs inside the caller's transaction so a
     * failure here rolls the payment match back instead of leaving a paid order unfulfilled.
     */
    public void fulfil(Order order) {
        if (order.getStatus() != OrderStatus.PAID) {
            return;
        }
        List<OrderItem> items = orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId());
        List<EntitlementGrant> grants = new ArrayList<>();

        for (OrderItem item : items) {
            for (ServicePackageBenefitResource benefit :
                    orderMapper.readBenefits(item.getBenefitsJson())) {
                grants.add(
                        new EntitlementGrant(
                                item.getId(),
                                benefit.entitlementType(),
                                benefit.quantity() * item.getQuantity(),
                                benefit.tier(),
                                benefit.durationDays(),
                                benefit.label()));
            }
        }

        if (!grants.isEmpty()) {
            entitlementService.grant(
                    order.getCompanyId(), order.getPurchasedByRecruiterId(), grants);
        }
        order.setStatus(OrderStatus.FULFILLED);
    }
}
