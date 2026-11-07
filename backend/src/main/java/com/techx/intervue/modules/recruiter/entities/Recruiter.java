package com.techx.intervue.modules.recruiter.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.recruiter.enums.RecruiterGender;
import com.techx.intervue.modules.recruiter.enums.RecruiterStatus;
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
@Table(name = "recruiters")
public class Recruiter extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RecruiterStatus status = RecruiterStatus.ACTIVE;

    @Column(name = "token_version", nullable = false)
    @Builder.Default
    private Integer tokenVersion = 1;

    @Column(unique = true, length = 20)
    private String phone;

    @Column(name = "phone_verified_at")
    private Instant phoneVerifiedAt;

    private String image;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private RecruiterGender gender;

    @Column(name = "company_name")
    private String companyName;

    @Column(length = 100)
    private String province;

    @Column(name = "district_ward")
    private String districtWard;

    @Column(name = "email_verified_at")
    private Instant emailVerifiedAt;

    @Column(name = "terms_accepted_at")
    private Instant termsAcceptedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "delete_requested_at")
    private Instant deleteRequestedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }

    public boolean isPhoneVerified() {
        return phoneVerifiedAt != null;
    }
}
