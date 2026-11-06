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
import com.techx.intervue.modules.company.enums.CompanyMemberRole;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.enums.PublishRightLossScope;
import com.techx.intervue.modules.company.events.PublishRightLostEvent;
import com.techx.intervue.modules.company.mappers.AdminBusinessVerificationMapper;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.company.requests.RevokeMembershipRequest;
import com.techx.intervue.modules.company.requests.TransferCompanyOwnerRequest;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyAdminServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
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
    private final AdminBusinessVerificationMapper adminMapper;
    private final CompanyVerificationServiceInterface companyVerificationService;
    private final UserServiceInterface userService;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationPublisherInterface notificationPublisher;

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

        if (member.isOwner() && activeOwnerCount(companyId) <= 1) {
            throw new AppException(ErrorCode.LAST_COMPANY_OWNER);
        }

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
                        .scope(PublishRightLossScope.INDIVIDUAL)
                        .cause(PublishRightLossCause.MEMBERSHIP_REVOKED)
                        .reassignToUserId(ownerIdOf(companyId))
                        .occurredAt(Instant.now())
                        .build());
        return membersOf(companyId);
    }

    @Override
    @Transactional
    public List<CompanyMemberResource> transferOwner(
            Long companyId, TransferCompanyOwnerRequest request, RequestActor actor) {
        Company company = requireCompany(companyId);
        List<CompanyMember> active =
                companyMemberRepository.findByCompanyIdAndStatus(
                        companyId, CompanyMemberStatus.ACTIVE);

        CompanyMember next =
                active.stream()
                        .filter(member -> member.getUserId().equals(request.userId()))
                        .findFirst()
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_COMPANY_MEMBER));
        if (next.isOwner()) {
            throw AppException.validation("userId", "This member already owns the company");
        }

        List<Long> demoted =
                active.stream()
                        .filter(CompanyMember::isOwner)
                        .map(CompanyMember::getUserId)
                        .toList();
        active.stream()
                .filter(CompanyMember::isOwner)
                .forEach(member -> member.setRole(CompanyMemberRole.MEMBER));
        next.setRole(CompanyMemberRole.OWNER);
        companyMemberRepository.saveAll(active);

        audit(
                actor,
                AuditAction.COMPANY_OWNER_TRANSFERRED,
                AuditTargetType.COMPANY,
                companyId,
                "newOwner=" + request.userId(),
                null);
        notifyOwnerTransferred(company, next.getUserId(), demoted);
        return membersOf(companyId);
    }

    private List<CompanyMemberResource> membersOf(Long companyId) {
        List<CompanyMember> members = companyMemberRepository.findByCompanyId(companyId);
        Map<Long, UserResource> users =
                members.isEmpty()
                        ? Map.of()
                        : userService
                                .findByIds(members.stream().map(CompanyMember::getUserId).toList())
                                .stream()
                                .collect(Collectors.toMap(UserResource::id, Function.identity()));
        return members.stream()
                .map(
                        member ->
                                adminMapper.toMemberResource(
                                        member,
                                        users.get(member.getUserId()),
                                        member.isActive()
                                                && companyVerificationService.canPublish(
                                                        member.getUserId())))
                .toList();
    }

    private long activeOwnerCount(Long companyId) {
        return companyMemberRepository.countByCompanyIdAndRoleAndStatus(
                companyId, CompanyMemberRole.OWNER, CompanyMemberStatus.ACTIVE);
    }

    private Long ownerIdOf(Long companyId) {
        return companyMemberRepository
                .findByCompanyIdAndStatus(companyId, CompanyMemberStatus.ACTIVE)
                .stream()
                .filter(CompanyMember::isOwner)
                .map(CompanyMember::getUserId)
                .findFirst()
                .orElse(null);
    }

    private void notifyOwnerTransferred(
            Company company, Long newOwnerId, List<Long> previousOwnerIds) {
        List<NotificationCommand> commands = new ArrayList<>();
        commands.add(
                membershipChange(
                        company, newOwnerId, "Bạn đã trở thành người sở hữu doanh nghiệp này."));
        previousOwnerIds.stream()
                .filter(id -> !id.equals(newOwnerId))
                .map(
                        id ->
                                membershipChange(
                                        company,
                                        id,
                                        "Quyền sở hữu doanh nghiệp đã được chuyển cho một thành"
                                                + " viên khác."))
                .forEach(commands::add);
        notificationPublisher.publishAll(commands);
    }

    private NotificationCommand membershipChange(Company company, Long recipientId, String change) {
        return NotificationCommand.builder()
                .recipientType(RecipientType.RECRUITER)
                .recipientId(recipientId)
                .type(NotificationType.COMPANY_MEMBERSHIP_CHANGED)
                .params(Map.of("companyName", company.getName(), "change", change))
                .actionUrl("/recruiter/company")
                .build();
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
