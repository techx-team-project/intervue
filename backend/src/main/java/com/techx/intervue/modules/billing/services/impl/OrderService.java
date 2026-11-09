package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.mappers.OrderMapper;
import com.techx.intervue.modules.billing.mappers.ServicePackageMapper;
import com.techx.intervue.modules.billing.repositories.CartItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderInvoiceDetailRepository;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageBenefitRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.requests.CheckoutRequest;
import com.techx.intervue.modules.billing.resources.OrderResource;
import com.techx.intervue.modules.billing.resources.OrderSummaryResource;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.OrderServiceInterface;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService implements OrderServiceInterface {

    private static final Duration RESUBMIT_WINDOW = Duration.ofMinutes(2);
    private static final Set<OrderStatus> ONE_TIME_BLOCKING =
            Set.of(
                    OrderStatus.PENDING_PAYMENT,
                    OrderStatus.UNDERPAID,
                    OrderStatus.PAID,
                    OrderStatus.FULFILLED);
    private static final Set<OrderStatus> CANCELLABLE =
            Set.of(OrderStatus.PENDING_PAYMENT, OrderStatus.UNDERPAID);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderInvoiceDetailRepository invoiceDetailRepository;
    private final ServicePackageRepository packageRepository;
    private final ServicePackageBenefitRepository benefitRepository;
    private final ServicePackageMapper packageMapper;
    private final OrderMapper orderMapper;
    private final OrderPricing orderPricing;
    private final OrderCodeGenerator codeGenerator;
    private final BillingSettingsServiceInterface billingSettings;
    private final CartItemRepository cartItemRepository;
    private final CartLineReader cartLineReader;
    private final CompanyServiceInterface companyService;

    @Override
    @Transactional
    public OrderResource checkout(CheckoutRequest request, Long recruiterId) {
        CompanyResource company = requireCompany(recruiterId);
        BillingSettings settings = billingSettings.current();

        boolean fromCart = request.packageId() == null;
        List<CartItem> cartItems =
                fromCart ? cartLineReader.read(recruiterId, request.cartItemIds()) : List.of();
        Map<ServicePackage, Integer> lines =
                fromCart ? toLines(cartItems) : singleLine(request.packageId(), request.quantity());
        if (lines.isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        long subtotal = 0;
        for (Map.Entry<ServicePackage, Integer> line : lines.entrySet()) {
            subtotal += line.getKey().getPrice() * line.getValue();
        }
        OrderPricing.Totals totals = orderPricing.compute(subtotal, 0L, settings.getVatRate());

        Order duplicate =
                orderRepository
                        .findFirstByPurchasedByRecruiterIdAndStatusAndTotalAmountAndCreatedAtAfter(
                                recruiterId,
                                OrderStatus.PENDING_PAYMENT,
                                totals.totalAmount(),
                                Instant.now().minus(RESUBMIT_WINDOW))
                        .orElse(null);
        // A retried submit must return the pending order, not a rule error such as
        // TRIAL_ALREADY_USED
        if (duplicate != null) {
            return toResource(duplicate);
        }

        assertPackagesPurchasable(lines.keySet(), company.id());

        if (orderRepository.countByCompanyIdAndStatus(company.id(), OrderStatus.PENDING_PAYMENT)
                >= settings.getMaxPendingOrders()) {
            throw new AppException(ErrorCode.TOO_MANY_PENDING_ORDERS);
        }

        Order order =
                orderRepository.save(
                        Order.builder()
                                .code(codeGenerator.generate(settings.getOrderCodePrefix()))
                                .companyId(company.id())
                                .purchasedByRecruiterId(recruiterId)
                                .status(OrderStatus.PENDING_PAYMENT)
                                .subtotal(totals.subtotal())
                                .discountAmount(totals.discountAmount())
                                .subtotalAfterDiscount(totals.subtotalAfterDiscount())
                                .vatRate(settings.getVatRate())
                                .vatAmount(totals.vatAmount())
                                .totalAmount(totals.totalAmount())
                                .currency("VND")
                                .expiresAt(
                                        Instant.now()
                                                .plus(
                                                        Duration.ofHours(
                                                                settings.getOrderExpireHours())))
                                .build());

        orderItemRepository.saveAll(buildItems(order, lines));
        invoiceDetailRepository.save(buildInvoiceDetail(order, request));

        if (fromCart) {
            // Only the purchased lines leave the cart; anything left unselected stays
            cartItemRepository.deleteAll(cartItems);
            cartItemRepository.flush();
        }
        return toResource(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderSummaryResource> search(Pageable pageable, Long recruiterId) {
        CompanyResource company = requireCompany(recruiterId);
        Page<Order> page =
                orderRepository.findAllByCompanyIdOrderByCreatedAtDesc(company.id(), pageable);
        Map<Long, Integer> counts = countItems(page.getContent());
        return page.map(
                order ->
                        orderMapper.toSummaryResource(
                                order, counts.getOrDefault(order.getId(), 0)));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResource findByCode(String code, Long recruiterId) {
        return toResource(requireOrder(code, recruiterId));
    }

    @Override
    @Transactional
    public OrderResource cancel(String code, Long recruiterId) {
        Order order = requireOrder(code, recruiterId);
        if (!order.getPurchasedByRecruiterId().equals(recruiterId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        if (!CANCELLABLE.contains(order.getStatus())) {
            throw new AppException(ErrorCode.ORDER_NOT_PAYABLE);
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        return toResource(order);
    }

    private Map<ServicePackage, Integer> toLines(List<CartItem> cartItems) {
        Map<ServicePackage, Integer> lines = new LinkedHashMap<>();
        for (CartItem item : cartItems) {
            lines.put(item.getServicePackage(), item.getQuantity());
        }
        return lines;
    }

    private Map<ServicePackage, Integer> singleLine(Long packageId, Integer quantity) {
        ServicePackage servicePackage =
                packageRepository
                        .findById(packageId)
                        .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
        Map<ServicePackage, Integer> lines = new LinkedHashMap<>();
        lines.put(servicePackage, quantity == null ? 1 : quantity);
        return lines;
    }

    private void assertPackagesPurchasable(Set<ServicePackage> packages, Long companyId) {
        for (ServicePackage servicePackage : packages) {
            if (servicePackage.getStatus() != ServicePackageStatus.ACTIVE) {
                throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
            }
            if (Boolean.TRUE.equals(servicePackage.getOneTimePerCompany())
                    && orderItemRepository.existsForCompanyAndPackage(
                            companyId, servicePackage.getCode(), ONE_TIME_BLOCKING)) {
                throw new AppException(ErrorCode.TRIAL_ALREADY_USED);
            }
        }
    }

    private List<OrderItem> buildItems(Order order, Map<ServicePackage, Integer> lines) {
        List<OrderItem> items = new ArrayList<>();
        for (Map.Entry<ServicePackage, Integer> line : lines.entrySet()) {
            ServicePackage servicePackage = line.getKey();
            int quantity = line.getValue();
            items.add(
                    OrderItem.builder()
                            .order(order)
                            .servicePackage(servicePackage)
                            .packageCode(servicePackage.getCode())
                            .packageName(servicePackage.getName())
                            .unitPrice(servicePackage.getPrice())
                            .quantity(quantity)
                            .lineTotal(servicePackage.getPrice() * quantity)
                            .validityDays(servicePackage.getValidityDays())
                            .bonusCredits(servicePackage.getBonusCredits())
                            .benefitsJson(
                                    orderMapper.writeBenefits(
                                            benefitRepository
                                                    .findAllByServicePackageIdOrderByDisplayOrderAsc(
                                                            servicePackage.getId())
                                                    .stream()
                                                    .map(packageMapper::toBenefitResource)
                                                    .toList()))
                            .build());
        }
        return items;
    }

    private OrderInvoiceDetail buildInvoiceDetail(Order order, CheckoutRequest request) {
        return OrderInvoiceDetail.builder()
                .order(order)
                .invoiceType(request.invoiceType())
                .taxId(request.taxId())
                .companyName(request.companyName())
                .companyAddress(request.companyAddress())
                .fullName(request.fullName())
                .identityNumber(request.identityNumber())
                .personalAddress(request.personalAddress())
                .recipientEmail(request.recipientEmail().trim())
                .build();
    }

    private Map<Long, Integer> countItems(List<Order> orders) {
        if (orders.isEmpty()) {
            return Map.of();
        }
        Map<Long, Integer> counts = new LinkedHashMap<>();
        orderItemRepository
                .findAllByOrderIdInOrderByIdAsc(orders.stream().map(Order::getId).toList())
                .forEach(item -> counts.merge(item.getOrder().getId(), 1, Integer::sum));
        return counts;
    }

    private Order requireOrder(String code, Long recruiterId) {
        CompanyResource company = requireCompany(recruiterId);
        return orderRepository
                .findByCodeAndCompanyId(code, company.id())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private OrderResource toResource(Order order) {
        return orderMapper.toResource(
                order,
                orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId()),
                invoiceDetailRepository.findByOrderId(order.getId()).orElse(null));
    }

    private CompanyResource requireCompany(Long recruiterId) {
        try {
            return companyService.findMyCompany(recruiterId);
        } catch (AppException cause) {
            if (cause.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw cause;
        }
    }
}
