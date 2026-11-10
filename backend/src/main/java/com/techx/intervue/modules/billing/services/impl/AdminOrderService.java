package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.Invoice;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import com.techx.intervue.modules.billing.mappers.OrderMapper;
import com.techx.intervue.modules.billing.repositories.InvoiceRepository;
import com.techx.intervue.modules.billing.repositories.OrderItemRepository;
import com.techx.intervue.modules.billing.repositories.OrderRepository;
import com.techx.intervue.modules.billing.repositories.RefundRequestRepository;
import com.techx.intervue.modules.billing.requests.SearchAdminOrdersRequest;
import com.techx.intervue.modules.billing.resources.AdminOrderResource;
import com.techx.intervue.modules.billing.resources.RevenueReportResource;
import com.techx.intervue.modules.billing.resources.RevenueReportResource.MonthlyRevenue;
import com.techx.intervue.modules.billing.resources.RevenueReportResource.PackageRevenue;
import com.techx.intervue.modules.billing.services.interfaces.AdminOrderServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminOrderService implements AdminOrderServiceInterface {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("yyyy-MM");
    // Money that actually arrived: a refunded order was still paid once, and what went back out
    // is counted separately from the approved refunds
    private static final Set<OrderStatus> COLLECTED =
            EnumSet.of(
                    OrderStatus.PAID,
                    OrderStatus.FULFILLED,
                    OrderStatus.REFUND_REQUESTED,
                    OrderStatus.REFUNDED);
    private static final Set<OrderStatus> AWAITING =
            EnumSet.of(OrderStatus.PENDING_PAYMENT, OrderStatus.UNDERPAID);
    private static final int MONTHS_SHOWN = 12;

    private final OrderRepository orderRepository;
    private final RefundRequestRepository refundRepository;
    private final OrderItemRepository orderItemRepository;
    private final InvoiceRepository invoiceRepository;
    private final OrderMapper orderMapper;
    private final CompanyServiceInterface companyService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminOrderResource> search(SearchAdminOrdersRequest request, Pageable pageable) {
        Page<Order> page =
                orderRepository.findAll(AdminOrderSpecifications.matching(request), pageable);
        Map<Long, String> names = companyNames(page.getContent());
        return page.map(order -> toResource(order, List.of(), names.get(order.getCompanyId())));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderResource findByCode(String code) {
        Order order =
                orderRepository
                        .findByCode(code.trim().toUpperCase())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        List<OrderItem> items = orderItemRepository.findAllByOrderIdOrderByIdAsc(order.getId());
        return toResource(order, items, companyNames(List.of(order)).get(order.getCompanyId()));
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueReportResource revenue() {
        List<Order> orders = orderRepository.findAll();

        Map<OrderStatus, Integer> byStatus = new EnumMap<>(OrderStatus.class);
        long collected = 0;
        long pending = 0;
        for (Order order : orders) {
            byStatus.merge(order.getStatus(), 1, Integer::sum);
            if (COLLECTED.contains(order.getStatus())) {
                collected += order.getPaidAmount();
            } else if (AWAITING.contains(order.getStatus())) {
                pending += order.getTotalAmount() - order.getPaidAmount();
            }
        }

        long refunded =
                refundRepository.findAll().stream()
                        .filter(refund -> refund.getStatus() == RefundStatus.APPROVED)
                        .mapToLong(
                                refund ->
                                        refund.getApprovedAmount() == null
                                                ? 0L
                                                : refund.getApprovedAmount())
                        .sum();

        List<Order> paid =
                orders.stream().filter(order -> COLLECTED.contains(order.getStatus())).toList();

        return RevenueReportResource.builder()
                .collectedTotal(collected)
                .refundedTotal(refunded)
                .netTotal(collected - refunded)
                .pendingTotal(pending)
                .paidOrderCount(paid.size())
                .ordersByStatus(byStatus)
                .byMonth(monthly(paid))
                .byPackage(byPackage(paid))
                .build();
    }

    private List<MonthlyRevenue> monthly(List<Order> paid) {
        Map<String, long[]> buckets = new LinkedHashMap<>();
        for (Order order : paid) {
            String month =
                    MONTH.format(
                            (order.getPaidAt() == null ? order.getCreatedAt() : order.getPaidAt())
                                    .atZone(VIETNAM));
            long[] counters = buckets.computeIfAbsent(month, key -> new long[2]);
            counters[0] += order.getPaidAmount();
            counters[1] += 1;
        }
        return buckets.entrySet().stream()
                .map(
                        entry ->
                                new MonthlyRevenue(
                                        entry.getKey(),
                                        entry.getValue()[0],
                                        (int) entry.getValue()[1]))
                .sorted(Comparator.comparing(MonthlyRevenue::month).reversed())
                .limit(MONTHS_SHOWN)
                .toList();
    }

    private List<PackageRevenue> byPackage(List<Order> paid) {
        if (paid.isEmpty()) {
            return List.of();
        }
        List<OrderItem> items =
                orderItemRepository.findAllByOrderIdInOrderByIdAsc(
                        paid.stream().map(Order::getId).toList());

        Map<String, PackageRevenue> totals = new LinkedHashMap<>();
        for (OrderItem item : items) {
            PackageRevenue current =
                    totals.getOrDefault(
                            item.getPackageCode(),
                            new PackageRevenue(
                                    item.getPackageCode(), item.getPackageName(), 0, 0L));
            totals.put(
                    item.getPackageCode(),
                    new PackageRevenue(
                            current.packageCode(),
                            current.packageName(),
                            current.quantity() + item.getQuantity(),
                            current.collected() + item.getLineTotal()));
        }
        return totals.values().stream()
                .sorted(Comparator.comparing(PackageRevenue::collected).reversed())
                .toList();
    }

    private Map<Long, String> companyNames(List<Order> orders) {
        Map<Long, String> names = new HashMap<>();
        for (Long companyId :
                orders.stream().map(Order::getCompanyId).collect(Collectors.toSet())) {
            try {
                names.put(companyId, companyService.findSummary(companyId).name());
            } catch (AppException ignored) {
                names.put(companyId, null);
            }
        }
        return names;
    }

    private AdminOrderResource toResource(Order order, List<OrderItem> items, String companyName) {
        return AdminOrderResource.builder()
                .id(order.getId())
                .code(order.getCode())
                .status(order.getStatus())
                .companyId(order.getCompanyId())
                .companyName(companyName)
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .vatAmount(order.getVatAmount())
                .totalAmount(order.getTotalAmount())
                .paidAmount(order.getPaidAmount())
                .currency(order.getCurrency())
                .invoiceNumber(
                        invoiceRepository
                                .findByOrderId(order.getId())
                                .map(Invoice::getNumber)
                                .orElse(null))
                .expiresAt(order.getExpiresAt())
                .paidAt(order.getPaidAt())
                .createdAt(order.getCreatedAt())
                .items(new ArrayList<>(items.stream().map(orderMapper::toItemResource).toList()))
                .build();
    }
}
