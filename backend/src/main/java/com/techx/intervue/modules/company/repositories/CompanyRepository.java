package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.Company;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository
        extends JpaRepository<Company, Long>, JpaSpecificationExecutor<Company> {

    boolean existsByTaxCode(String taxCode);

    Optional<Company> findByTaxCode(String taxCode);
}
