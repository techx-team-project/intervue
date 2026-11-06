package com.techx.intervue.modules.company.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.company.enums.BusinessType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
@Table(name = "company_profiles")
public class CompanyProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_member_id", nullable = false)
    private CompanyMember member;

    @Column(name = "trading_name")
    private String tradingName;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", length = 20)
    private BusinessType businessType;

    @Column(length = 150)
    private String industry;

    private String website;

    @Column(length = 150)
    private String market;

    @Column(name = "target_customers", length = 150)
    private String targetCustomers;

    @Column(length = 30)
    private String size;

    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "logo_public_id")
    private String logoPublicId;
}
