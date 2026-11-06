package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.CompanyPhoto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyPhotoRepository extends JpaRepository<CompanyPhoto, Long> {

    List<CompanyPhoto> findByProfileIdOrderBySortOrderAsc(Long profileId);

    Optional<CompanyPhoto> findByIdAndProfileId(Long id, Long profileId);

    long countByProfileId(Long profileId);
}
