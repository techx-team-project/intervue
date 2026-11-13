package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.modules.job.entities.JobFreePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobFreePostRepository extends JpaRepository<JobFreePost, Long> {

    long countByCompanyId(Long companyId);
}
