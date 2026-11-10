package com.techx.intervue.modules.connect.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.requests.ReportConversationRequest;
import com.techx.intervue.modules.connect.requests.SendMessageRequest;
import com.techx.intervue.modules.connect.resources.ConnectRulesAckResource;
import com.techx.intervue.modules.connect.resources.ConnectUnreadCountResource;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectRulesAckServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectSseServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectUnreadServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface.AttachmentContent;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/candidate/connect")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateConnectController extends BaseController {

    private final ConnectionServiceInterface connectionService;
    private final ConnectSseServiceInterface sseService;
    private final ConnectUnreadServiceInterface unreadService;
    private final ConnectRulesAckServiceInterface rulesAckService;

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

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResource<MessageResource>> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                connectionService.sendMessage(
                        ConnectActorType.CANDIDATE, principal.getId(), id, request),
                "Message sent successfully!");
    }

    @PostMapping("/conversations/{id}/messages/attachment")
    public ResponseEntity<ApiResource<MessageResource>> sendAttachment(
            @PathVariable Long id,
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String caption,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                connectionService.sendAttachment(
                        ConnectActorType.CANDIDATE, principal.getId(), id, file, caption),
                "Attachment sent successfully!");
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResource<PageResource<MessageResource>>> messages(
            @PathVariable Long id,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                connectionService.listMessages(
                        ConnectActorType.CANDIDATE, principal.getId(), id, pageable),
                "Messages retrieved successfully!");
    }

    @GetMapping("/conversations/{id}/messages/{messageId}/attachment")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long id,
            @PathVariable Long messageId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        AttachmentContent content =
                connectionService.downloadAttachment(
                        ConnectActorType.CANDIDATE, principal.getId(), id, messageId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(content.contentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(content.fileName())
                                .build()
                                .toString())
                .body(content.bytes());
    }

    @PostMapping("/conversations/{id}/block")
    public ResponseEntity<ApiResource<Void>> block(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.block(ConnectActorType.CANDIDATE, principal.getId(), id);
        return ok(null, "Conversation blocked successfully!");
    }

    @PostMapping("/conversations/{id}/report")
    public ResponseEntity<ApiResource<Void>> report(
            @PathVariable Long id,
            @Valid @RequestBody ReportConversationRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.report(
                ConnectActorType.CANDIDATE,
                principal.getId(),
                id,
                request.reasonCode(),
                request.reasonNote());
        return ok(null, "Report submitted successfully!");
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResource<ConnectUnreadCountResource>> unreadCount(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                new ConnectUnreadCountResource(
                        unreadService.total(ConnectActorType.CANDIDATE, principal.getId())),
                "Unread count retrieved successfully!");
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal CustomUserDetails principal) {
        return sseService.subscribe(ConnectActorType.CANDIDATE, principal.getId());
    }

    @GetMapping("/rules-ack")
    public ResponseEntity<ApiResource<ConnectRulesAckResource>> rulesAck(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                rulesAckService.get(ConnectActorType.CANDIDATE, principal.getId()),
                "Rules acknowledgement retrieved successfully!");
    }

    @PostMapping("/rules-ack")
    public ResponseEntity<ApiResource<ConnectRulesAckResource>> acknowledgeRules(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                rulesAckService.acknowledge(ConnectActorType.CANDIDATE, principal.getId()),
                "Rules acknowledged successfully!");
    }
}
