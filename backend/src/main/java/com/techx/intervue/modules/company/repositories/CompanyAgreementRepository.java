package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.CompanyAgreement;
import com.techx.intervue.modules.company.enums.AgreementScope;
import com.techx.intervue.modules.company.enums.AgreementType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyAgreementRepository extends JpaRepository<CompanyAgreement, Long> {

    Optional<CompanyAgreement> findFirstByCompanyIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
            Long companyId, AgreementScope scope, AgreementType agreementType);

    Optional<CompanyAgreement> findFirstByUserIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
            Long userId, AgreementScope scope, AgreementType agreementType);
}
