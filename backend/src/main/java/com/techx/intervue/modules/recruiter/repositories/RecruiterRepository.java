package com.techx.intervue.modules.recruiter.repositories;

import com.techx.intervue.modules.recruiter.entities.Recruiter;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {

    boolean existsByEmail(String email);

    Optional<Recruiter> findByEmail(String email);

    @Modifying
    @Query("UPDATE Recruiter r SET r.lastLoginAt = :at WHERE r.id = :id")
    void touchLastLogin(@Param("id") Long id, @Param("at") Instant at);
}
