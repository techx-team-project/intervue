package com.techx.intervue.modules.ads.repositories;

import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdBookingRepository extends JpaRepository<AdBooking, Long> {

    List<AdBooking> findAllByAdSlotIdAndWeekStartBetweenAndStatusIn(
            Long adSlotId, LocalDate from, LocalDate to, Collection<AdBookingStatus> statuses);

    Optional<AdBooking> findByAdSlotIdAndWeekStartAndStatusIn(
            Long adSlotId, LocalDate weekStart, Collection<AdBookingStatus> statuses);

    boolean existsByAdSlotIdAndWeekStartAndStatusIn(
            Long adSlotId, LocalDate weekStart, Collection<AdBookingStatus> statuses);

    List<AdBooking> findAllByOrderId(Long orderId);

    List<AdBooking> findAllByCompanyIdAndStatusOrderByWeekStartDesc(
            Long companyId, AdBookingStatus status);

    List<AdBooking> findAllByStatusAndWeekStartLessThanEqualAndConsumedAtIsNull(
            AdBookingStatus status, LocalDate weekStart);

    List<AdBooking> findAllByStatusAndWeekStartBetweenAndConsumedAtIsNull(
            AdBookingStatus status, LocalDate from, LocalDate to);

    List<AdBooking> findAllByStatusAndWeekStartBetweenAndReminderSentAtIsNull(
            AdBookingStatus status, LocalDate from, LocalDate to);
}
