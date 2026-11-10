package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.entities.AdCreative;
import com.techx.intervue.modules.ads.entities.AdMetric;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import com.techx.intervue.modules.ads.repositories.AdBookingRepository;
import com.techx.intervue.modules.ads.repositories.AdCreativeRepository;
import com.techx.intervue.modules.ads.repositories.AdMetricRepository;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.resources.RecruiterAdBookingResource;
import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdBookingService implements AdBookingServiceInterface {

    private final AdSlotRepository slotRepository;
    private final AdBookingRepository bookingRepository;
    private final AdCreativeRepository creativeRepository;
    private final AdMetricRepository metricRepository;
    private final AdBookingPresenter presenter;

    @Override
    @Transactional
    public void reserve(
            Long companyId,
            Long orderId,
            Long orderItemId,
            Long servicePackageId,
            List<LocalDate> weeks) {
        if (weeks.isEmpty()) {
            throw new AppException(ErrorCode.AD_WEEKS_REQUIRED);
        }
        AdSlot slot =
                slotRepository
                        .findByServicePackageId(servicePackageId)
                        .filter(found -> Boolean.TRUE.equals(found.getIsActive()))
                        .orElseThrow(() -> new AppException(ErrorCode.AD_SLOT_NOT_FOUND));

        for (LocalDate week : weeks.stream().distinct().sorted().toList()) {
            if (!AdWeeks.isBookable(week)) {
                throw AppException.validation("weeks", "Week " + week + " is no longer bookable");
            }
            try {
                bookingRepository.saveAndFlush(
                        AdBooking.builder()
                                .adSlotId(slot.getId())
                                .weekStart(week)
                                .companyId(companyId)
                                .orderId(orderId)
                                .orderItemId(orderItemId)
                                .status(AdBookingStatus.RESERVED)
                                .build());
            } catch (DataIntegrityViolationException taken) {
                // The unique key on (slot, week) is the only thing that can decide a tie
                throw new AppException(ErrorCode.AD_SLOT_UNAVAILABLE);
            }
        }
    }

    @Override
    @Transactional
    public void confirm(Long orderId) {
        for (AdBooking booking : bookingRepository.findAllByOrderId(orderId)) {
            if (booking.getStatus() == AdBookingStatus.RESERVED) {
                booking.setStatus(AdBookingStatus.BOOKED);
            }
        }
    }

    @Override
    @Transactional
    public void release(Long orderId) {
        List<AdBooking> bookings = bookingRepository.findAllByOrderId(orderId);
        // Deleted rather than flagged: a RELEASED row would keep holding the unique key
        bookings.removeIf(booking -> booking.getStatus() != AdBookingStatus.RESERVED);
        if (!bookings.isEmpty()) {
            bookingRepository.deleteAll(bookings);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecruiterAdBookingResource> listForCompany(Long companyId) {
        List<AdBooking> bookings = new java.util.ArrayList<>();
        bookings.addAll(
                bookingRepository.findAllByCompanyIdAndStatusOrderByWeekStartDesc(
                        companyId, AdBookingStatus.BOOKED));
        bookings.addAll(
                bookingRepository.findAllByCompanyIdAndStatusOrderByWeekStartDesc(
                        companyId, AdBookingStatus.RESERVED));
        if (bookings.isEmpty()) {
            return List.of();
        }

        Map<Long, AdSlot> slots =
                slotRepository
                        .findAllById(bookings.stream().map(AdBooking::getAdSlotId).toList())
                        .stream()
                        .collect(Collectors.toMap(AdSlot::getId, Function.identity()));
        List<Long> bookingIds = bookings.stream().map(AdBooking::getId).toList();
        Map<Long, AdCreative> creatives =
                creativeRepository.findAllByAdBookingIdIn(bookingIds).stream()
                        .collect(Collectors.toMap(AdCreative::getAdBookingId, Function.identity()));

        Map<Long, int[]> totals = new HashMap<>();
        for (AdMetric metric :
                metricRepository.findAllByAdBookingIdInOrderByMetricDateAsc(bookingIds)) {
            int[] counters = totals.computeIfAbsent(metric.getAdBookingId(), key -> new int[2]);
            counters[0] += metric.getImpressions();
            counters[1] += metric.getClicks();
        }

        return bookings.stream()
                .sorted((left, right) -> right.getWeekStart().compareTo(left.getWeekStart()))
                .map(
                        booking ->
                                presenter.toResource(
                                        booking,
                                        slots.get(booking.getAdSlotId()),
                                        creatives.get(booking.getId()),
                                        totals.getOrDefault(booking.getId(), new int[2])[0],
                                        totals.getOrDefault(booking.getId(), new int[2])[1]))
                .toList();
    }
}
