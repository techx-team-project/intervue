package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.entities.AdCreative;
import com.techx.intervue.modules.ads.entities.AdMetric;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.repositories.AdCreativeRepository;
import com.techx.intervue.modules.ads.repositories.AdMetricRepository;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.resources.RecruiterAdBookingResource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdBookingPresenter {

    private final AdSlotRepository slotRepository;
    private final AdCreativeRepository creativeRepository;
    private final AdMetricRepository metricRepository;

    public RecruiterAdBookingResource toResource(AdBooking booking) {
        AdSlot slot = slotRepository.findById(booking.getAdSlotId()).orElse(null);
        AdCreative creative = creativeRepository.findByAdBookingId(booking.getId()).orElse(null);
        int[] counters = new int[2];
        for (AdMetric metric :
                metricRepository.findAllByAdBookingIdInOrderByMetricDateAsc(
                        List.of(booking.getId()))) {
            counters[0] += metric.getImpressions();
            counters[1] += metric.getClicks();
        }
        return toResource(booking, slot, creative, counters[0], counters[1]);
    }

    public RecruiterAdBookingResource toResource(
            AdBooking booking, AdSlot slot, AdCreative creative, int impressions, int clicks) {
        return RecruiterAdBookingResource.builder()
                .id(booking.getId())
                .slotCode(slot == null ? null : slot.getCode())
                .slotName(slot == null ? null : slot.getName())
                .width(slot == null ? null : slot.getWidth())
                .height(slot == null ? null : slot.getHeight())
                .weekStart(booking.getWeekStart())
                .weekEnd(booking.getWeekStart().plusDays(6))
                .status(booking.getStatus())
                .running(booking.getWeekStart().equals(AdWeeks.currentWeek()))
                .creativeStatus(creative == null ? null : creative.getStatus())
                .creativeImageUrl(creative == null ? null : creative.getImageUrl())
                .creativeTargetUrl(creative == null ? null : creative.getTargetUrl())
                .rejectionReason(creative == null ? null : creative.getRejectionReason())
                .impressions(impressions)
                .clicks(clicks)
                .build();
    }
}
