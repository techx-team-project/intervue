package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import com.techx.intervue.modules.ads.mappers.AdMapper;
import com.techx.intervue.modules.ads.repositories.AdBookingRepository;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.resources.AdSlotCalendarResource;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import com.techx.intervue.modules.ads.resources.AdWeekResource;
import com.techx.intervue.modules.ads.services.interfaces.AdPackageLookupPortInterface;
import com.techx.intervue.modules.ads.services.interfaces.AdSlotServiceInterface;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdSlotService implements AdSlotServiceInterface {

    static final Set<AdBookingStatus> HOLDING =
            EnumSet.of(AdBookingStatus.RESERVED, AdBookingStatus.BOOKED);
    private static final int MAX_WEEKS_AHEAD = 26;

    private final AdSlotRepository slotRepository;
    private final AdBookingRepository bookingRepository;
    private final AdPackageLookupPortInterface packageLookup;
    private final AdMapper adMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AdSlotResource> listActive() {
        return slotRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(
                        slot ->
                                adMapper.toSlotResource(
                                        slot,
                                        packageLookup
                                                .slugOf(slot.getServicePackageId())
                                                .orElse(null)))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdSlotCalendarResource calendar(String code, int weeksAhead, Long companyId) {
        AdSlot slot =
                slotRepository
                        .findByCode(code.trim().toUpperCase())
                        .filter(found -> Boolean.TRUE.equals(found.getIsActive()))
                        .orElseThrow(() -> new AppException(ErrorCode.AD_SLOT_NOT_FOUND));

        int span = Math.clamp(weeksAhead, 1, MAX_WEEKS_AHEAD);
        LocalDate first = AdWeeks.firstBookable();
        LocalDate last = first.plusWeeks(span - 1L);

        Map<LocalDate, AdBooking> taken =
                bookingRepository
                        .findAllByAdSlotIdAndWeekStartBetweenAndStatusIn(
                                slot.getId(), first, last, HOLDING)
                        .stream()
                        .collect(Collectors.toMap(AdBooking::getWeekStart, Function.identity()));

        List<AdWeekResource> weeks = new ArrayList<>();
        for (int index = 0; index < span; index++) {
            LocalDate weekStart = first.plusWeeks(index);
            AdBooking booking = taken.get(weekStart);
            weeks.add(
                    new AdWeekResource(
                            weekStart,
                            weekStart.plusDays(6),
                            booking == null,
                            booking != null && booking.getCompanyId().equals(companyId)));
        }

        return AdSlotCalendarResource.builder()
                .slot(
                        adMapper.toSlotResource(
                                slot,
                                packageLookup.slugOf(slot.getServicePackageId()).orElse(null)))
                .weeks(weeks)
                .build();
    }
}
