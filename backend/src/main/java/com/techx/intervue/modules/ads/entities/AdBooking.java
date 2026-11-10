package com.techx.intervue.modules.ads.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
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
@Table(name = "ad_bookings")
public class AdBooking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ad_slot_id", nullable = false)
    private Long adSlotId;

    /** Always a Monday: the unique key on (slot, week) is what stops two buyers colliding. */
    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_item_id")
    private Long orderItemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AdBookingStatus status = AdBookingStatus.RESERVED;

    /**
     * Set once this week has started and its entitlement unit was spent; null means still
     * refundable.
     */
    @Column(name = "consumed_at")
    private Instant consumedAt;

    /** Set the first time the "week starting soon, no approved creative" reminder goes out. */
    @Column(name = "reminder_sent_at")
    private Instant reminderSentAt;
}
