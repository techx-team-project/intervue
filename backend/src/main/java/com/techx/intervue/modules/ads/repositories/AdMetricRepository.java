package com.techx.intervue.modules.ads.repositories;

import com.techx.intervue.modules.ads.entities.AdMetric;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdMetricRepository extends JpaRepository<AdMetric, Long> {

    Optional<AdMetric> findByAdBookingIdAndMetricDate(Long adBookingId, LocalDate metricDate);

    List<AdMetric> findAllByAdBookingIdInOrderByMetricDateAsc(Collection<Long> adBookingIds);
}
