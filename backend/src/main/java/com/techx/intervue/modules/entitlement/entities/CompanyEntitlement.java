package com.techx.intervue.modules.entitlement.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
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
@Table(name = "company_entitlements")
public class CompanyEntitlement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "source_order_item_id")
    private Long sourceOrderItemId;

    @Column(name = "purchased_by_recruiter_id")
    private Long purchasedByRecruiterId;

    @Enumerated(EnumType.STRING)
    @Column(name = "entitlement_type", nullable = false, length = 40)
    private EntitlementType entitlementType;

    @Column(nullable = false, length = 255)
    private String label;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "remaining_quantity", nullable = false)
    private Integer remainingQuantity;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "is_bonus", nullable = false)
    @Builder.Default
    private boolean bonus = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EntitlementStatus status = EntitlementStatus.AVAILABLE;

    @Column(name = "activation_deadline")
    private Instant activationDeadline;
}
