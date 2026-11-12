package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.util.List;
import java.util.Map;
import lombok.Builder;

/** Every figure here is counted from the orders table; nothing is estimated. */
@Builder
public record RevenueReportResource(
        Long collectedTotal,
        Long refundedTotal,
        Long netTotal,
        Long pendingTotal,
        Integer paidOrderCount,
        Map<OrderStatus, Integer> ordersByStatus,
        List<MonthlyRevenue> byMonth,
        List<PackageRevenue> byPackage) {

    public record MonthlyRevenue(String month, Long collected, Integer orderCount) {}

    public record PackageRevenue(String packageName, Integer quantity, Long collected) {}
}
