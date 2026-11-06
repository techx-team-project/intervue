package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.enums.RecruiterStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {

    @Query("SELECT r.id FROM Recruiter r WHERE r.status = :status")
    List<Long> findIdsByStatus(@Param("status") RecruiterStatus status);

    boolean existsByEmail(String email);

    Optional<Recruiter> findByEmail(String email);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    @Modifying
    @Query("UPDATE Recruiter r SET r.lastLoginAt = :at WHERE r.id = :id")
    void touchLastLogin(@Param("id") Long id, @Param("at") Instant at);

    @Query(
            """
                SELECT r FROM Recruiter r
                WHERE r.status = :status AND r.deleteRequestedAt <= :cutoff
            """)
    List<Recruiter> findPendingDeletionsExpired(
            @Param("status") RecruiterStatus status,
            @Param("cutoff") Instant cutoff,
            Pageable pageable);
}
