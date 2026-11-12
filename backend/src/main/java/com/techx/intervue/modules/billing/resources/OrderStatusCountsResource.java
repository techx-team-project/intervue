package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.util.Map;

public record OrderStatusCountsResource(long total, Map<OrderStatus, Long> byStatus) {}
