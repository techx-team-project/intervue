package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import com.techx.intervue.modules.billing.entities.BillingSettings;
import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderInvoiceDetail;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.entities.PaymentTransaction;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.mappers.OrderMapper;
import com.techx.intervue.modules.billing.mappers.ServicePackageMapper;
import com.techx.intervue.modules.billing.repositories.CartItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderInvoiceDetailRepository;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.PaymentTransactionRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageBenefitRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.requests.CheckoutRequest;
import com.techx.intervue.modules.billing.resources.OrderResource;
import com.techx.intervue.modules.billing.resources.OrderSummaryResource;
import com.techx.intervue.modules.billing.resources.PaymentTransactionResource;
import com.techx.intervue.modules.billing.services.interfaces.BillingSettingsServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.OrderServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface.AppliedVoucher;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
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
    private final RecruiterCompanyResolver companyResolver;
    private final RecruiterServiceInterface recruiterService;
    private final BillingNotifier billingNotifier;
    private final VoucherServiceInterface voucherService;
    private final OrderFulfillmentService orderFulfillmentService;
    private final AdCartMeta adCartMeta;
    private final AdBookingServiceInterface adBookingService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    @Transactional
    public OrderResource checkout(CheckoutRequest request, Long recruiterId) {
        CompanyResource company = companyResolver.require(recruiterId);
        BillingSettings settings = billingSettings.current();

        boolean fromCart = request.packageId() == null;
        List<CartItem> cartItems =
                fromCart ? cartLineReader.read(recruiterId, request.cartItemIds()) : List.of();
        List<Line> lines =
                fromCart
                        ? toLines(cartItems)
                        : singleLine(request.packageId(), request.quantity(), request.weeks());
        if (lines.isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        long subtotal = 0;
        for (Line line : lines) {
            subtotal += line.servicePackage().getPrice() * line.quantity();
        }
        List<VoucherServiceInterface.BillableLine> billableLines =
                lines.stream()
                        .map(
                                line ->
                                        new VoucherServiceInterface.BillableLine(
                                                line.servicePackage().getId(),
                                                line.servicePackage().getPrice() * line.quantity()))
                        .toList();
        AppliedVoucher applied =
                isFilled(request.voucherCode())
                        ? voucherService.apply(request.voucherCode(), billableLines, company.id())
                        : null;
        long discount = applied == null ? 0L : applied.discountAmount();
        OrderPricing.Totals totals =
                orderPricing.compute(subtotal, discount, settings.getVatRate());

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

        assertPackagesPurchasable(lines.stream().map(Line::servicePackage).toList(), company.id());

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

        List<OrderItem> savedItems = orderItemRepository.saveAll(buildItems(order, lines));
        invoiceDetailRepository.save(buildInvoiceDetail(order, request));
        reserveAdWeeks(order, savedItems, company.id());
        if (applied != null) {
            voucherService.claim(applied, order.getId(), company.id());
        }

        // Nobody will ever transfer zero, so a fully discounted order settles on the spot
        if (totals.totalAmount() == 0) {
            orderItemRepository.flush();
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(Instant.now());
            orderFulfillmentService.fulfil(order);
        }

        if (fromCart) {
            // Only the purchased lines leave the cart; anything left unselected stays
            cartItemRepository.deleteAll(cartItems);
            cartItemRepository.flush();
        }

        billingNotifier.orderCreated(order, recruiterService.getMe(recruiterId).name());
        return toResource(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderSummaryResource> search(Pageable pageable, Long recruiterId) {
        CompanyResource company = companyResolver.require(recruiterId);
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
        voucherService.release(order.getId());
        adBookingService.release(order.getId());
        return toResource(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentTransactionResource> searchPayments(Pageable pageable, Long recruiterId) {
        Long companyId = companyResolver.requireId(recruiterId);
        return paymentTransactionRepository
                .findAllByMatchedOrder_CompanyIdOrderByTransactionAtDesc(companyId, pageable)
                .map(this::toPaymentResource);
    }

    private PaymentTransactionResource toPaymentResource(PaymentTransaction transaction) {
        return new PaymentTransactionResource(
                transaction.getId(),
                transaction.getSepayId(),
                transaction.getGateway(),
                transaction.getAccountNumber(),
                transaction.getContent(),
                transaction.getAmountIn(),
                transaction.getReferenceCode(),
                transaction.getTransactionAt(),
                transaction.getStatus(),
                transaction.getMatchedOrder() == null
                        ? null
                        : transaction.getMatchedOrder().getCode(),
                transaction.getNote());
    }

    private boolean isFilled(String value) {
        return value != null && !value.isBlank();
    }

    private void reserveAdWeeks(Order order, List<OrderItem> items, Long companyId) {
        for (OrderItem item : items) {
            List<LocalDate> weeks = adCartMeta.readWeeks(item.getMetaJson());
            if (weeks.isEmpty()) {
                continue;
            }
            adBookingService.reserve(
                    companyId,
                    order.getId(),
                    item.getId(),
                    item.getServicePackage().getId(),
                    weeks);
        }
    }

    /** A banner line carries the weeks it bought, so the quantity alone is not the whole line. */
    private record Line(ServicePackage servicePackage, int quantity, String metaJson) {}

    private List<Line> toLines(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(
                        item ->
                                new Line(
                                        item.getServicePackage(),
                                        item.getQuantity(),
                                        item.getMetaJson()))
                .toList();
    }

    private List<Line> singleLine(Long packageId, Integer quantity, List<LocalDate> weeks) {
        ServicePackage servicePackage =
                packageRepository
                        .findById(packageId)
                        .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
        int amount = quantity == null ? 1 : quantity;
        return List.of(
                new Line(servicePackage, amount, adCartMeta.build(servicePackage, weeks, amount)));
    }

    private void assertPackagesPurchasable(List<ServicePackage> packages, Long companyId) {
        for (ServicePackage servicePackage : packages) {
            if (!servicePackage.isAvailableInCatalog()) {
                throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
            }
            if (Boolean.TRUE.equals(servicePackage.getOneTimePerCompany())
                    && orderItemRepository.existsForCompanyAndPackage(
                            companyId, servicePackage.getCode(), ONE_TIME_BLOCKING)) {
                throw new AppException(ErrorCode.TRIAL_ALREADY_USED);
            }
        }
    }

    private List<OrderItem> buildItems(Order order, List<Line> lines) {
        List<OrderItem> items = new ArrayList<>();
        for (Line line : lines) {
            ServicePackage servicePackage = line.servicePackage();
            int quantity = line.quantity();
            items.add(
                    OrderItem.builder()
                            .order(order)
                            .servicePackage(servicePackage)
                            .packageCode(servicePackage.getCode())
                            .packageName(servicePackage.getName())
                            .unitPrice(servicePackage.getPrice())
                            .quantity(quantity)
                            .lineTotal(servicePackage.getPrice() * quantity)
                            .metaJson(line.metaJson())
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
        CompanyResource company = companyResolver.require(recruiterId);
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
}
