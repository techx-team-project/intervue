package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.CompanyProfile;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {

    @Query("SELECT p FROM CompanyProfile p WHERE p.member.id = :memberId")
    Optional<CompanyProfile> findByMemberId(@Param("memberId") Long memberId);

    @Query(
            "SELECT p FROM CompanyProfile p JOIN FETCH p.member m"
                    + " WHERE m.userId IN :recruiterIds AND p.logoPublicId IS NOT NULL")
    List<CompanyProfile> findWithLogoByRecruiterIds(
            @Param("recruiterIds") Collection<Long> recruiterIds);
}
