package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "billing_settings")
public class BillingSettings extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal vatRate;

    @Column(name = "order_expire_hours", nullable = false)
    private Integer orderExpireHours;

    @Column(name = "order_code_prefix", nullable = false, length = 10)
    private String orderCodePrefix;

    @Column(name = "max_pending_orders", nullable = false)
    private Integer maxPendingOrders;
}
