package com.techx.intervue.modules.connect.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.requests.EditMessageRequest;
import com.techx.intervue.modules.connect.requests.MarkReadRequest;
import com.techx.intervue.modules.connect.requests.ReactMessageRequest;
import com.techx.intervue.modules.connect.requests.ReportConversationRequest;
import com.techx.intervue.modules.connect.requests.SendMessageRequest;
import com.techx.intervue.modules.connect.requests.TypingRequest;
import com.techx.intervue.modules.connect.requests.UnsendMessageRequest;
import com.techx.intervue.modules.connect.resources.ConnectMuteStatusResource;
import com.techx.intervue.modules.connect.resources.ConnectRulesAckResource;
import com.techx.intervue.modules.connect.resources.ConversationSummaryResource;
import com.techx.intervue.modules.connect.resources.MessageReactionResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectModerationServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectRulesAckServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectSseServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectUnreadServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface.AttachmentContent;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface.LinkPreview;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public abstract class AbstractParticipantConnectController extends BaseController {

    protected final ConnectionServiceInterface connectionService;
    protected final ConnectSseServiceInterface sseService;
    protected final ConnectUnreadServiceInterface unreadService;
    protected final ConnectRulesAckServiceInterface rulesAckService;
    protected final ConnectModerationServiceInterface moderationService;
    protected final LinkPreviewServiceInterface linkPreviewService;

    protected AbstractParticipantConnectController(
            ConnectionServiceInterface connectionService,
            ConnectSseServiceInterface sseService,
            ConnectUnreadServiceInterface unreadService,
            ConnectRulesAckServiceInterface rulesAckService,
            ConnectModerationServiceInterface moderationService,
            LinkPreviewServiceInterface linkPreviewService) {
        this.connectionService = connectionService;
        this.sseService = sseService;
        this.unreadService = unreadService;
        this.rulesAckService = rulesAckService;
        this.moderationService = moderationService;
        this.linkPreviewService = linkPreviewService;
    }

    protected abstract ConnectActorType actorType();

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ApiResource<ConversationSummaryResource>> conversation(
            @PathVariable String id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                connectionService.getConversationByIdentifier(actorType(), principal.getId(), id),
                "Conversation retrieved successfully!");
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResource<MessageResource>> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                connectionService.sendMessage(actorType(), principal.getId(), id, request),
                "Message sent successfully!");
    }

    @PostMapping("/conversations/{id}/messages/attachment")
    public ResponseEntity<ApiResource<MessageResource>> sendAttachment(
            @PathVariable Long id,
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String caption,
            @RequestParam(required = false) String clientMessageId,
            @RequestParam(required = false) Long replyToMessageId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                connectionService.sendAttachment(
                        actorType(),
                        principal.getId(),
                        id,
                        file,
                        caption,
                        clientMessageId,
                        replyToMessageId),
                "Attachment sent successfully!");
    }

    @PatchMapping("/conversations/{id}/messages/{messageId}")
    public ResponseEntity<ApiResource<MessageResource>> editMessage(
            @PathVariable Long id,
            @PathVariable Long messageId,
            @Valid @RequestBody EditMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                connectionService.editMessage(
                        actorType(), principal.getId(), id, messageId, request),
                "Message updated successfully!");
    }

    @PostMapping("/conversations/{id}/messages/{messageId}/unsend")
    public ResponseEntity<ApiResource<MessageResource>> unsendMessage(
            @PathVariable Long id,
            @PathVariable Long messageId,
            @Valid @RequestBody UnsendMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                connectionService.unsendMessage(
                        actorType(), principal.getId(), id, messageId, request.scope()),
                "Message updated successfully!");
    }

    @PostMapping("/conversations/{id}/messages/{messageId}/reactions")
    public ResponseEntity<ApiResource<List<MessageReactionResource>>> reactToMessage(
            @PathVariable Long id,
            @PathVariable Long messageId,
            @Valid @RequestBody ReactMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                connectionService.reactToMessage(
                        actorType(), principal.getId(), id, messageId, request.emoji()),
                "Reaction updated successfully!");
    }

    @PostMapping("/conversations/{id}/read")
    public ResponseEntity<ApiResource<Void>> markAsRead(
            @PathVariable Long id,
            @RequestBody(required = false) MarkReadRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.markAsRead(
                actorType(),
                principal.getId(),
                id,
                request != null ? request.lastReadMessageId() : null);
        return ok(null, "Conversation marked as read!");
    }

    @PostMapping("/conversations/{id}/typing")
    public ResponseEntity<ApiResource<Void>> typing(
            @PathVariable Long id,
            @RequestBody TypingRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.sendTyping(actorType(), principal.getId(), id, request.typing());
        return ok(null, "Typing status updated!");
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResource<PageResource<MessageResource>>> messages(
            @PathVariable Long id,
            @RequestParam(required = false) Long beforeId,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                connectionService.listMessages(
                        actorType(), principal.getId(), id, beforeId, pageable),
                "Messages retrieved successfully!");
    }

    @GetMapping("/conversations/{id}/messages/{messageId}/attachment")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long id,
            @PathVariable Long messageId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        AttachmentContent content =
                connectionService.downloadAttachment(actorType(), principal.getId(), id, messageId);
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
        connectionService.block(actorType(), principal.getId(), id);
        return ok(null, "Conversation blocked successfully!");
    }

    @PostMapping("/conversations/{id}/unblock")
    public ResponseEntity<ApiResource<Void>> unblock(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.unblock(actorType(), principal.getId(), id);
        return ok(null, "Conversation unblocked successfully!");
    }

    @PostMapping("/conversations/{id}/report")
    public ResponseEntity<ApiResource<Void>> report(
            @PathVariable Long id,
            @Valid @RequestBody ReportConversationRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        connectionService.report(
                actorType(), principal.getId(), id, request.reasonCode(), request.reasonNote());
        return ok(null, "Report submitted successfully!");
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal CustomUserDetails principal) {
        return sseService.subscribe(actorType(), principal.getId());
    }

    @GetMapping("/rules-ack")
    public ResponseEntity<ApiResource<ConnectRulesAckResource>> rulesAck(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                rulesAckService.get(actorType(), principal.getId()),
                "Rules acknowledgement retrieved successfully!");
    }

    @PostMapping("/rules-ack")
    public ResponseEntity<ApiResource<ConnectRulesAckResource>> acknowledgeRules(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                rulesAckService.acknowledge(actorType(), principal.getId()),
                "Rules acknowledged successfully!");
    }

    @GetMapping("/mute-status")
    public ResponseEntity<ApiResource<ConnectMuteStatusResource>> muteStatus(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                moderationService.muteStatus(actorType(), principal.getId()),
                "Mute status retrieved successfully!");
    }

    @GetMapping("/link-preview")
    public ResponseEntity<ApiResource<LinkPreview>> linkPreview(@RequestParam String url) {
        return ok(
                linkPreviewService.resolve(url).orElse(null),
                "Link preview resolved successfully!");
    }
}
