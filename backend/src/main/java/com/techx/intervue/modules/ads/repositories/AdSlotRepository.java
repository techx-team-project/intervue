package com.techx.intervue.modules.ads.repositories;

import com.techx.intervue.modules.ads.entities.AdSlot;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdSlotRepository extends JpaRepository<AdSlot, Long> {

    List<AdSlot> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    List<AdSlot> findAllByOrderByDisplayOrderAsc();

    Optional<AdSlot> findByCode(String code);

    Optional<AdSlot> findByServicePackageId(Long servicePackageId);
}
