package com.techx.intervue.modules.candidate.credits.repositories;

import com.techx.intervue.modules.candidate.credits.entities.CandidateCreditBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateCreditBalanceRepository
        extends JpaRepository<CandidateCreditBalance, Long> {}
