package com.techx.intervue.modules.connect.controllers;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.requests.SendInvitationRequest;
import com.techx.intervue.modules.connect.resources.ConnectUnreadCountResource;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.EligibleCandidateResource;
import com.techx.intervue.modules.connect.resources.InvitationResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectModerationServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectRulesAckServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectSseServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectUnreadServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/connect")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterConnectController extends AbstractParticipantConnectController {

    public RecruiterConnectController(
            ConnectionServiceInterface connectionService,
            ConnectSseServiceInterface sseService,
            ConnectUnreadServiceInterface unreadService,
            ConnectRulesAckServiceInterface rulesAckService,
            ConnectModerationServiceInterface moderationService,
            LinkPreviewServiceInterface linkPreviewService) {
        super(
                connectionService,
                sseService,
                unreadService,
                rulesAckService,
                moderationService,
                linkPreviewService);
    }

    @Override
    protected ConnectActorType actorType() {
        return ConnectActorType.RECRUITER;
    }

    @GetMapping("/eligible-candidates")
    public ResponseEntity<ApiResource<PageResource<EligibleCandidateResource>>> eligibleCandidates(
            @RequestParam(required = false) String search,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                connectionService.eligibleCandidates(principal.getId(), search, pageable),
                "Eligible candidates retrieved successfully!");
    }

    @PostMapping("/invitations")
    public ResponseEntity<ApiResource<InvitationResource>> invite(
            @Valid @RequestBody SendInvitationRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                connectionService.invite(principal.getId(), request),
                "Invitation sent successfully!");
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResource<PageResource<ConversationSummaryResource>>> conversations(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                connectionService.recruiterConversations(principal.getId(), pageable),
                "Conversations retrieved successfully!");
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResource<ConnectUnreadCountResource>> unreadCount(
            @AuthenticationPrincipal CustomUserDetails principal) {
        long unreadMessages = unreadService.total(ConnectActorType.RECRUITER, principal.getId());
        return ok(
                new ConnectUnreadCountResource(unreadMessages, unreadMessages, 0L),
                "Unread count retrieved successfully!");
    }
}
