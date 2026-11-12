package com.techx.intervue.modules.entitlement.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
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
@Table(name = "entitlement_usages")
public class EntitlementUsage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entitlement_id", nullable = false)
    private Long entitlementId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Enumerated(EnumType.STRING)
    @Column(name = "entitlement_type", nullable = false, length = 40)
    private EntitlementType entitlementType;

    @Column(name = "job_id")
    private Long jobId;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    /** What the units were drawn for, e.g. a credit conversion's target package; optional. */
    @Column(length = 255)
    private String note;

    @Column(name = "batch_key", length = 64)
    private String batchKey;

    @Column(name = "activated_by_recruiter_id")
    private Long activatedByRecruiterId;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "ends_at")
    private Instant endsAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EntitlementUsageStatus status = EntitlementUsageStatus.ACTIVE;
}
