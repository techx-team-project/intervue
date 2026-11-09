package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "service_package_benefits")
public class ServicePackageBenefit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "package_id", nullable = false)
    private ServicePackage servicePackage;

    @Enumerated(EnumType.STRING)
    @Column(name = "entitlement_type", nullable = false, length = 40)
    private EntitlementType entitlementType;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(nullable = false, length = 255)
    private String label;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}
