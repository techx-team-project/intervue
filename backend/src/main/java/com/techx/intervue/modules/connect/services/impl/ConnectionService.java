package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectMessageType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import com.techx.intervue.modules.connect.mappers.ConnectMapper;
import com.techx.intervue.modules.connect.repositories.ConnectionMessageRepository;
import com.techx.intervue.modules.connect.repositories.ConnectionRepository;
import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.services.interfaces.CandidateEligibilityPortInterface;
import com.techx.intervue.modules.connect.services.interfaces.CandidateEligibilityPortInterface.EligibleCandidate;
import com.techx.intervue.modules.connect.services.interfaces.ConnectQuotaServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConnectionService implements ConnectionServiceInterface {

    private final ConnectionRepository connectionRepository;
    private final ConnectionMessageRepository messageRepository;
    private final CandidateEligibilityPortInterface eligibilityPort;
    private final ConnectQuotaServiceInterface quotaService;
    private final ConnectCompanyScope companyScope;
    private final CompanyServiceInterface companyService;
    private final NotificationPublisherInterface notificationPublisher;
    private final ConnectMapper mapper;

    @Override
    @Transactional
    public InvitationResource invite(Long recruiterId, SendInvitationRequest request) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        if (connectionRepository.existsByCandidateIdAndCompanyId(
                request.candidateId(), companyId)) {
            throw new AppException(ErrorCode.CONNECTION_ALREADY_EXISTS);
        }
        EligibleCandidate candidate =
                eligibilityPort
                        .findCandidateSummary(request.candidateId(), companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_ELIGIBLE_TO_CONNECT));
        quotaService.reserve(recruiterId);
        CompanySummaryResource company = companyService.findSummary(companyId);

        Connection connection =
                connectionRepository.save(
                        Connection.builder()
                                .candidateId(candidate.candidateId())
                                .candidateName(candidate.fullName())
                                .candidateEmail(candidate.email())
                                .companyId(companyId)
                                .companyName(company.name())
                                .initiatedByRecruiterId(recruiterId)
                                .status(ConnectionStatus.PENDING)
                                .invitedAt(Instant.now())
                                .build());
        messageRepository.save(
                ConnectionMessage.builder()
                        .connectionId(connection.getId())
                        .senderType(ConnectActorType.RECRUITER)
                        .senderId(recruiterId)
                        .messageType(ConnectMessageType.TEXT)
                        .body(request.message())
                        .build());

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(candidate.candidateId())
                        .type(NotificationType.CONNECT_INVITATION_RECEIVED)
                        .params(Map.of("companyName", company.name()))
                        .actionUrl("/candidate/conversations")
                        .build());

        return mapper.toInvitation(connection, request.message());
    }

    @Override
    @Transactional
    public void accept(Long candidateId, Long connectionId) {
        Connection connection = requirePending(connectionId, candidateId);
        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setRespondedAt(Instant.now());

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(connection.getInitiatedByRecruiterId())
                        .type(NotificationType.CONNECT_INVITATION_ACCEPTED)
                        .params(Map.of("candidateName", connection.getCandidateName()))
                        .actionUrl("/recruiter/conversations")
                        .build());
    }

    @Override
    @Transactional
    public void decline(Long candidateId, Long connectionId) {
        Connection connection = requirePending(connectionId, candidateId);
        connection.setStatus(ConnectionStatus.DECLINED);
        connection.setRespondedAt(Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> candidateInvitations(
            Long candidateId, Pageable pageable) {
        return connectionRepository
                .findByCandidateIdAndStatus(candidateId, ConnectionStatus.PENDING, pageable)
                .map(mapper::toConversationSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> candidateConversations(
            Long candidateId, Pageable pageable) {
        return connectionRepository
                .findByCandidateIdAndStatus(candidateId, ConnectionStatus.ACCEPTED, pageable)
                .map(mapper::toConversationSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EligibleCandidateResource> eligibleCandidates(
            Long recruiterId, String search, Pageable pageable) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        Set<Long> alreadyConnected =
                connectionRepository
                        .findByCompanyIdAndStatusIn(
                                companyId, List.of(ConnectionStatus.values()), Pageable.unpaged())
                        .map(Connection::getCandidateId)
                        .toSet();
        return eligibilityPort
                .search(companyId, search, alreadyConnected, pageable)
                .map(
                        candidate ->
                                EligibleCandidateResource.builder()
                                        .candidateId(candidate.candidateId())
                                        .fullName(candidate.fullName())
                                        .email(candidate.email())
                                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationSummaryResource> recruiterConversations(
            Long recruiterId, Pageable pageable) {
        Long companyId = companyScope.companyIdOf(recruiterId);
        return connectionRepository
                .findByCompanyIdAndStatusIn(
                        companyId,
                        List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED),
                        pageable)
                .map(mapper::toConversationSummary);
    }

    private Connection requirePending(Long connectionId, Long candidateId) {
        return connectionRepository
                .findByIdAndCandidateId(connectionId, candidateId)
                .filter(connection -> connection.getStatus() == ConnectionStatus.PENDING)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
