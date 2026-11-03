package com.techx.intervue.modules.company.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.company.enums.BusinessType;
import com.techx.intervue.modules.company.enums.CompanyVerificationStatus;
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
@Table(name = "companies")
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "trading_name")
    private String tradingName;

    @Column(name = "tax_code", nullable = false, length = 20)
    private String taxCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", nullable = false, length = 20)
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

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    @Builder.Default
    private CompanyVerificationStatus verificationStatus = CompanyVerificationStatus.UNVERIFIED;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    public boolean isVerified() {
        return verificationStatus == CompanyVerificationStatus.VERIFIED;
    }
}
