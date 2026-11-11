package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import com.techx.intervue.modules.ads.repositories.AdBookingRepository;
import com.techx.intervue.modules.ads.repositories.AdCreativeRepository;
import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AdBookingScheduler {

    private static final int REMINDER_WINDOW_DAYS = 3;

    private final AdBookingServiceInterface bookingService;
    private final AdBookingRepository bookingRepository;
    private final AdCreativeRepository creativeRepository;
    private final AdsNotifier adsNotifier;

    @Scheduled(cron = "0 15 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void settleElapsedWeeks() {
        bookingService.settleElapsedWeeks();
    }

    @Scheduled(cron = "0 30 0 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void remindUnapprovedCreatives() {
        // Reminded once per booking, not every day of the window — this scheduler fires daily
        for (AdBooking booking :
                bookingRepository.findAllByStatusAndWeekStartBetweenAndReminderSentAtIsNull(
                        AdBookingStatus.BOOKED,
                        AdWeeks.today(),
                        AdWeeks.today().plusDays(REMINDER_WINDOW_DAYS))) {
            boolean hasApprovedCreative =
                    creativeRepository
                            .findByAdBookingId(booking.getId())
                            .filter(creative -> creative.getStatus() == AdCreativeStatus.APPROVED)
                            .isPresent();
            if (!hasApprovedCreative) {
                adsNotifier.weekStartingSoonNoCreative(booking);
                booking.setReminderSentAt(Instant.now());
            }
        }
    }
}
