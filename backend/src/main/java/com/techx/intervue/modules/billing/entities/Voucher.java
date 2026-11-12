package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.billing.enums.VoucherAccentColor;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
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
@Table(name = "vouchers")
public class Voucher extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(nullable = false, length = 150)
    private String label;

    @Column(length = 500)
    private String description;

    @Column(name = "ribbon_label", length = 40)
    private String ribbonLabel;

    @Enumerated(EnumType.STRING)
    @Column(name = "accent_color", nullable = false, length = 20)
    @Builder.Default
    private VoucherAccentColor accentColor = VoucherAccentColor.EMERALD;

    @Column(name = "conditions_json", columnDefinition = "TEXT")
    private String conditionsJson;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "voucher_applicable_packages",
            joinColumns = @JoinColumn(name = "voucher_id"),
            inverseJoinColumns = @JoinColumn(name = "package_id"))
    @OrderBy("displayOrder ASC, id ASC")
    @Builder.Default
    private Set<ServicePackage> applicablePackages = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private VoucherDiscountType discountType;

    @Column(name = "discount_value", nullable = false)
    private Long discountValue;

    @Column(name = "max_discount")
    private Long maxDiscount;

    @Column(name = "min_order_value", nullable = false)
    @Builder.Default
    private Long minOrderValue = 0L;

    @Column(name = "starts_at")
    private Instant startsAt;

    @Column(name = "ends_at")
    private Instant endsAt;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "per_company_limit")
    private Integer perCompanyLimit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VoucherStatus status = VoucherStatus.ACTIVE;
}
