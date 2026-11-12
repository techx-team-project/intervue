package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.billing.enums.ServicePackageBadge;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
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
@Table(name = "service_packages")
public class ServicePackage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "short_description", length = 1000)
    private String shortDescription;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ServicePackageBadge badge = ServicePackageBadge.NONE;

    @Column(name = "vip_ribbon", nullable = false)
    @Builder.Default
    private Boolean vipRibbon = false;

    @Column(name = "accent_color", length = 20)
    private String accentColor;

    @Column(name = "hero_image_url", length = 500)
    private String heroImageUrl;

    @Column(name = "validity_days")
    private Integer validityDays;

    @Column(name = "bonus_credits", nullable = false)
    @Builder.Default
    private Integer bonusCredits = 0;

    @Column(name = "one_time_per_company", nullable = false)
    @Builder.Default
    private Boolean oneTimePerCompany = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ServicePackageStatus status = ServicePackageStatus.DRAFT;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    public boolean isAvailableInCatalog() {
        return status == ServicePackageStatus.ACTIVE
                && category != null
                && Boolean.TRUE.equals(category.getIsActive());
    }
}
