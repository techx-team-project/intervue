package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.enums.CompanyMemberRole;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyMemberRepository extends JpaRepository<CompanyMember, Long> {

    Optional<CompanyMember> findByCompanyIdAndUserId(Long companyId, Long userId);

    Optional<CompanyMember> findFirstByUserIdAndStatus(Long userId, CompanyMemberStatus status);

    List<CompanyMember> findByCompanyIdAndStatus(Long companyId, CompanyMemberStatus status);

    long countByCompanyIdAndRoleAndStatus(
            Long companyId, CompanyMemberRole role, CompanyMemberStatus status);
}
