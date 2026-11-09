package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
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
@Table(name = "payment_transactions")
public class PaymentTransaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sepay_id", nullable = false, unique = true, length = 40)
    private String sepayId;

    @Column(length = 100)
    private String gateway;

    @Column(name = "account_number", length = 30)
    private String accountNumber;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "amount_in", nullable = false)
    private Long amountIn;

    @Column(name = "reference_code", length = 100)
    private String referenceCode;

    @Column(name = "transaction_at", nullable = false)
    private Instant transactionAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentTransactionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_order_id")
    private Order matchedOrder;

    @Column(name = "matched_by_admin_id")
    private Long matchedByAdminId;

    @Column(length = 500)
    private String note;
}
