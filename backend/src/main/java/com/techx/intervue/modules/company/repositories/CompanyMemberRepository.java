package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.enums.CompanyMemberRole;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyMemberRepository extends JpaRepository<CompanyMember, Long> {

    @Query(
            """
                SELECT m FROM CompanyMember m
                JOIN FETCH m.company
                WHERE m.userId = :userId AND m.status = :status
            """)
    Optional<CompanyMember> findActiveWithCompany(
            @Param("userId") Long userId, @Param("status") CompanyMemberStatus status);

    boolean existsByUserIdAndStatus(Long userId, CompanyMemberStatus status);

    boolean existsByUserIdAndRoleAndStatus(
            Long userId, CompanyMemberRole role, CompanyMemberStatus status);

    Optional<CompanyMember> findByCompanyIdAndUserId(Long companyId, Long userId);

    List<CompanyMember> findByCompanyId(Long companyId);

    List<CompanyMember> findByCompanyIdAndStatus(Long companyId, CompanyMemberStatus status);

    long countByCompanyIdAndStatus(Long companyId, CompanyMemberStatus status);

    long countByCompanyIdAndRoleAndStatus(
            Long companyId, CompanyMemberRole role, CompanyMemberStatus status);
}
