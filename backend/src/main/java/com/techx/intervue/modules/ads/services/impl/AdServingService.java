package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.entities.AdCreative;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import com.techx.intervue.modules.ads.repositories.AdBookingRepository;
import com.techx.intervue.modules.ads.repositories.AdCreativeRepository;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.resources.ServedAdResource;
import com.techx.intervue.modules.ads.services.interfaces.AdServingServiceInterface;
import java.time.Duration;
import java.util.EnumSet;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdServingService implements AdServingServiceInterface {

    static final String IMPRESSION_KEY = "ads:impressions:";
    static final String CLICK_KEY = "ads:clicks:";
    private static final String CLICK_GUARD_KEY = "ads:click-guard:";
    private static final Duration CLICK_COOLDOWN = Duration.ofMinutes(1);
    private static final Duration COUNTER_TTL = Duration.ofDays(2);

    private final AdSlotRepository slotRepository;
    private final AdBookingRepository bookingRepository;
    private final AdCreativeRepository creativeRepository;
    private final StringRedisTemplate redis;

    @Override
    @Transactional(readOnly = true)
    public Optional<ServedAdResource> serve(String slotCode) {
        Optional<AdSlot> found =
                slotRepository
                        .findByCode(slotCode.trim().toUpperCase())
                        .filter(slot -> Boolean.TRUE.equals(slot.getIsActive()));
        if (found.isEmpty()) {
            return Optional.empty();
        }
        AdSlot slot = found.get();

        AdCreative creative = approvedCreativeFor(slot);
        if (creative == null) {
            return houseAd(slot);
        }

        countImpression(creative.getAdBookingId());
        return Optional.of(
                ServedAdResource.builder()
                        .slotCode(slot.getCode())
                        .width(slot.getWidth())
                        .height(slot.getHeight())
                        .imageUrl(creative.getImageUrl())
                        .targetUrl(creative.getTargetUrl())
                        .altText(creative.getAltText())
                        .house(false)
                        .bookingId(creative.getAdBookingId())
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public void recordClick(String slotCode, String clientIp) {
        AdSlot slot = slotRepository.findByCode(slotCode.trim().toUpperCase()).orElse(null);
        if (slot == null) {
            return;
        }
        AdCreative creative = approvedCreativeFor(slot);
        if (creative == null) {
            return;
        }
        // One click per IP per slot per minute keeps a refresh loop from inflating the report
        String guard = CLICK_GUARD_KEY + slot.getCode() + ":" + clientIp;
        if (!Boolean.TRUE.equals(redis.opsForValue().setIfAbsent(guard, "1", CLICK_COOLDOWN))) {
            return;
        }
        increment(CLICK_KEY + creative.getAdBookingId());
    }

    private AdCreative approvedCreativeFor(AdSlot slot) {
        AdBooking booking =
                bookingRepository
                        .findByAdSlotIdAndWeekStartAndStatusIn(
                                slot.getId(),
                                AdWeeks.currentWeek(),
                                EnumSet.of(AdBookingStatus.BOOKED))
                        .orElse(null);
        if (booking == null) {
            return null;
        }
        return creativeRepository
                .findByAdBookingId(booking.getId())
                .filter(creative -> creative.getStatus() == AdCreativeStatus.APPROVED)
                .orElse(null);
    }

    private Optional<ServedAdResource> houseAd(AdSlot slot) {
        if (slot.getHouseImageUrl() == null || slot.getHouseImageUrl().isBlank()) {
            return Optional.empty();
        }
        return Optional.of(
                ServedAdResource.builder()
                        .slotCode(slot.getCode())
                        .width(slot.getWidth())
                        .height(slot.getHeight())
                        .imageUrl(slot.getHouseImageUrl())
                        .targetUrl(slot.getHouseTargetUrl())
                        .altText(slot.getName())
                        .house(true)
                        .build());
    }

    private void countImpression(Long bookingId) {
        increment(IMPRESSION_KEY + bookingId);
    }

    // Counters live in Redis and are flushed to the table on a schedule; a page view must not write
    private void increment(String key) {
        Long value = redis.opsForValue().increment(key);
        if (value != null && value == 1L) {
            redis.expire(key, COUNTER_TTL);
        }
    }
}
