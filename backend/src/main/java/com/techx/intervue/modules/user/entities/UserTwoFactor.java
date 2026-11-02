package com.techx.intervue.modules.user.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.user.enums.TwoFactorMethod;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "user_two_factor")
public class UserTwoFactor extends BaseEntity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TwoFactorMethod method = TwoFactorMethod.TOTP;

    @Column(nullable = false)
    private String secret;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    public boolean isConfirmed() {
        return confirmedAt != null;
    }
}
