package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.taxcode.TaxCodeRecord;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.entities.CompanyProfile;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyProfileRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CompanyLinker {

    private final CompanyRepository companyRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyAuditor companyAuditor;

    @Transactional
    public CompanyMember registerAndLink(TaxCodeRecord record, RequestActor actor) {
        Optional<Company> existing = companyRepository.findByTaxCode(record.taxCode());
        Company company =
                existing.orElseGet(
                        () ->
                                companyRepository.save(
                                        Company.builder()
                                                .name(record.name())
                                                .taxCode(record.taxCode())
                                                .address(record.address())
                                                .build()));
        if (existing.isEmpty()) {
            companyAuditor.record(actor, AuditAction.COMPANY_CREATED, company);
        }
        return link(company, actor);
    }

    @Transactional
    public CompanyMember link(Company company, RequestActor actor) {
        Optional<CompanyMember> previous =
                companyMemberRepository.findByCompanyIdAndUserId(company.getId(), actor.userId());
        previous.ifPresent(this::rejectIfNotRejoinable);
        requireNoOtherCompany(actor.userId());

        CompanyMember member =
                previous.orElseGet(
                        () ->
                                CompanyMember.builder()
                                        .company(company)
                                        .userId(actor.userId())
                                        .build());
        member.setCompany(company);
        member.setStatus(CompanyMemberStatus.ACTIVE);
        member.setJoinedAt(Instant.now());
        member.setRevokedAt(null);
        member.setRevokedBy(null);
        member.setRevokeReason(null);
        CompanyMember saved = companyMemberRepository.save(member);

        if (companyProfileRepository.findByMemberId(saved.getId()).isEmpty()) {
            companyProfileRepository.save(CompanyProfile.builder().member(saved).build());
        }
        companyAuditor.record(actor, AuditAction.COMPANY_MEMBER_JOINED, company);
        return saved;
    }

    private void rejectIfNotRejoinable(CompanyMember previous) {
        switch (previous.getStatus()) {
            case ACTIVE -> throw new AppException(ErrorCode.ALREADY_COMPANY_MEMBER);
            case REVOKED -> throw new AppException(ErrorCode.COMPANY_MEMBERSHIP_REVOKED);
            case LEFT -> {
                /* rejoining is allowed */
            }
        }
    }

    private void requireNoOtherCompany(Long userId) {
        if (companyMemberRepository.existsByUserIdAndStatus(userId, CompanyMemberStatus.ACTIVE)) {
            throw new AppException(ErrorCode.ALREADY_IN_ANOTHER_COMPANY);
        }
    }
}
