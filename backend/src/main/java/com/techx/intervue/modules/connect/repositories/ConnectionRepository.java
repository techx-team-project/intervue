package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    Optional<Connection> findByCandidateIdAndCompanyId(Long candidateId, Long companyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query(
            "select c from Connection c where c.candidateId = :candidateId and c.companyId ="
                    + " :companyId")
    Optional<Connection> findForUpdateByCandidateIdAndCompanyId(
            @Param("candidateId") Long candidateId, @Param("companyId") Long companyId);

    long countByCandidateIdAndStatus(Long candidateId, ConnectionStatus status);

    Optional<Connection> findByIdAndCandidateId(Long id, Long candidateId);

    Optional<Connection> findByIdAndCompanyId(Long id, Long companyId);

    Optional<Connection> findByPublicId(String publicId);

    Page<Connection> findByCandidateIdAndStatus(
            Long candidateId, ConnectionStatus status, Pageable pageable);

    Page<Connection> findByCandidateIdAndStatusIn(
            Long candidateId, Collection<ConnectionStatus> statuses, Pageable pageable);

    Page<Connection> findByCompanyIdAndStatusIn(
            Long companyId, Collection<ConnectionStatus> statuses, Pageable pageable);
}
