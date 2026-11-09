package com.techx.intervue.modules.candidate.repositories;

import com.techx.intervue.modules.candidate.entities.IdentityVerification;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IdentityVerificationRepository extends JpaRepository<IdentityVerification, Long> {

    Optional<IdentityVerification> findByUserId(Long userId);

    boolean existsByUserIdAndStatus(Long userId, IdentityVerificationStatus status);

    boolean existsByIdNumberHashAndUserIdNotAndStatusIn(
            String idNumberHash, Long userId, Collection<IdentityVerificationStatus> statuses);

    boolean existsByIdNumberHashAndUserIdNotAndStatus(
            String idNumberHash, Long userId, IdentityVerificationStatus status);

    @Query(
            "SELECT v FROM IdentityVerification v WHERE (:status IS NULL OR v.status = :status)"
                    + " AND (:q IS NULL OR LOWER(v.fullName) LIKE :q OR v.idNumberLast4 LIKE :q)")
    Page<IdentityVerification> search(
            @Param("status") IdentityVerificationStatus status,
            @Param("q") String q,
            Pageable pageable);
}
