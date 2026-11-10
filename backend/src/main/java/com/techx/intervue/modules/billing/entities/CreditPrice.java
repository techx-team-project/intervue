package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "credit_prices")
public class CreditPrice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "entitlement_type", nullable = false, length = 40)
    private EntitlementType entitlementType;

    @Column(nullable = false)
    private Integer tier;

    @Column(name = "credit_cost", nullable = false)
    private Integer creditCost;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(nullable = false)
    private String label;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
