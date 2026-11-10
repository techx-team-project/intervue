package com.techx.intervue.modules.connect.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/connect")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateConnectController extends BaseController {

    private final ConnectionServiceInterface connectionService;

    @GetMapping("/invitations")
    public ResponseEntity<ApiResource<PageResource<ConversationSummaryResource>>> invitations(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                connectionService.candidateInvitations(principal.getId(), pageable),
                "Invitations retrieved successfully!");
    }

    @PostMapping("/invitations/{id}/accept")
    public ResponseEntity<ApiResource<Void>> accept(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.accept(principal.getId(), id);
        return ok(null, "Invitation accepted successfully!");
    }

    @PostMapping("/invitations/{id}/decline")
    public ResponseEntity<ApiResource<Void>> decline(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.decline(principal.getId(), id);
        return ok(null, "Invitation declined successfully!");
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResource<PageResource<ConversationSummaryResource>>> conversations(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                connectionService.candidateConversations(principal.getId(), pageable),
                "Conversations retrieved successfully!");
    }
}
