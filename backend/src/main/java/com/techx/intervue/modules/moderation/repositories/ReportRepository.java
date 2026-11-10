package com.techx.intervue.modules.moderation.repositories;

import com.techx.intervue.modules.moderation.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {}
