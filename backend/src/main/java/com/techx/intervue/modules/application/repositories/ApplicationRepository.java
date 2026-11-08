package com.techx.intervue.modules.application.repositories;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository
        extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {

    Optional<Application> findByIdAndCandidateId(Long id, Long candidateId);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    boolean existsByJobIdAndStatusNot(Long jobId, ApplicationStatus status);
}
