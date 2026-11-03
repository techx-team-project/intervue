package com.techx.intervue.modules.company.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.company.enums.AgreementAcceptanceMode;
import com.techx.intervue.modules.company.enums.AgreementScope;
import com.techx.intervue.modules.company.enums.AgreementStatus;
import com.techx.intervue.modules.company.enums.AgreementType;
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
@Table(name = "company_agreements")
public class CompanyAgreement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AgreementScope scope;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "signed_by", nullable = false)
    private Long signedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "agreement_type", nullable = false, length = 30)
    private AgreementType agreementType;

    @Enumerated(EnumType.STRING)
    @Column(name = "acceptance_mode", nullable = false, length = 30)
    private AgreementAcceptanceMode acceptanceMode;

    @Column(nullable = false, length = 20)
    private String version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AgreementStatus status;

    @Column(name = "accepted_at", nullable = false)
    private Instant acceptedAt;

    @Column(name = "storage_public_id")
    private String storagePublicId;

    public boolean isAccepted() {
        return status == AgreementStatus.ACCEPTED;
    }
}
