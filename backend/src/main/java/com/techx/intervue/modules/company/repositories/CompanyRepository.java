package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.Company;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository
        extends JpaRepository<Company, Long>, JpaSpecificationExecutor<Company> {

    Optional<Company> findByTaxCode(String taxCode);

    @Query(
            "select company from Company company where company.featuredUntil > :moment order by company.featuredUntil desc")
    List<Company> findFeatured(@Param("moment") Instant moment, Pageable pageable);
}
