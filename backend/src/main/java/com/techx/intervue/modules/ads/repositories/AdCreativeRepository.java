package com.techx.intervue.modules.ads.repositories;

import com.techx.intervue.modules.ads.entities.AdCreative;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdCreativeRepository extends JpaRepository<AdCreative, Long> {

    Optional<AdCreative> findByAdBookingId(Long adBookingId);

    List<AdCreative> findAllByAdBookingIdIn(Collection<Long> adBookingIds);

    Page<AdCreative> findAllByStatusOrderByCreatedAtAsc(AdCreativeStatus status, Pageable pageable);

    Page<AdCreative> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
