package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.events.PublishRightLostEvent;
import com.techx.intervue.modules.company.mappers.AdminBusinessVerificationMapper;
import com.techx.intervue.modules.company.repositories.CompanyAgreementRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.company.requests.RevokeMembershipRequest;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyAdminServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyAdminService implements CompanyAdminServiceInterface {

    private final CompanyRepository companyRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final CompanyAgreementRepository companyAgreementRepository;
    private final AdminBusinessVerificationMapper adminMapper;
    private final CompanyVerificationServiceInterface companyVerificationService;
    private final RecruiterServiceInterface recruiterService;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public List<CompanyMemberResource> findMembers(Long companyId) {
        requireCompany(companyId);
        return membersOf(companyId);
    }

    @Override
    @Transactional
    public List<CompanyMemberResource> revokeMembership(
            Long companyId, Long userId, RevokeMembershipRequest request, RequestActor actor) {
        Company company = requireCompany(companyId);
        CompanyMember member =
                companyMemberRepository
                        .findByCompanyIdAndUserId(companyId, userId)
                        .filter(CompanyMember::isActive)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_COMPANY_MEMBER));

        member.setStatus(CompanyMemberStatus.REVOKED);
        member.setRevokedAt(Instant.now());
        member.setRevokedBy(actor.userId());
        member.setRevokeReason(request.reason());
        companyMemberRepository.save(member);

        audit(
                actor,
                AuditAction.COMPANY_MEMBER_REVOKED,
                AuditTargetType.COMPANY_MEMBER,
                member.getId(),
                "company=" + companyId + " user=" + userId,
                request.reason());
        eventPublisher.publishEvent(
                PublishRightLostEvent.builder()
                        .userId(userId)
                        .companyId(companyId)
                        .companyName(company.getName())
                        .cause(PublishRightLossCause.MEMBERSHIP_REVOKED)
                        .occurredAt(Instant.now())
                        .build());
        return membersOf(companyId);
    }

    private List<CompanyMemberResource> membersOf(Long companyId) {
        List<CompanyMember> members = companyMemberRepository.findByCompanyId(companyId);
        Map<Long, RecruiterResource> recruiters =
                members.isEmpty()
                        ? Map.of()
                        : recruiterService
                                .findByIds(members.stream().map(CompanyMember::getUserId).toList())
                                .stream()
                                .collect(
                                        Collectors.toMap(
                                                RecruiterResource::id, Function.identity()));
        return members.stream()
                .map(
                        member ->
                                adminMapper.toMemberResource(
                                        member,
                                        recruiters.get(member.getUserId()),
                                        member.isActive()
                                                && companyVerificationService.canPublish(
                                                        member.getUserId()),
                                        companyAgreementRepository
                                                .hasAcceptedCandidateDataAgreement(
                                                        member.getUserId())))
                .toList();
    }

    private Company requireCompany(Long companyId) {
        return companyRepository
                .findById(companyId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void audit(
            RequestActor actor,
            AuditAction action,
            AuditTargetType targetType,
            Long targetId,
            String detail,
            String reason) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(targetType)
                        .targetId(targetId)
                        .reason(reason)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }
}
