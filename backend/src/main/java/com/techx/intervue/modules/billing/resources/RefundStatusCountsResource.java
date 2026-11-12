package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.RefundStatus;
import java.util.Map;

public record RefundStatusCountsResource(long total, Map<RefundStatus, Long> byStatus) {}
