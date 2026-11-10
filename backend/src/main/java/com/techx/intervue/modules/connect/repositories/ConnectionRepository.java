package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    boolean existsByCandidateIdAndCompanyId(Long candidateId, Long companyId);

    Optional<Connection> findByIdAndCandidateId(Long id, Long candidateId);

    Page<Connection> findByCandidateIdAndStatus(
            Long candidateId, ConnectionStatus status, Pageable pageable);

    Page<Connection> findByCandidateIdAndStatusIn(
            Long candidateId, Collection<ConnectionStatus> statuses, Pageable pageable);

    Page<Connection> findByCompanyIdAndStatusIn(
            Long companyId, Collection<ConnectionStatus> statuses, Pageable pageable);
}
