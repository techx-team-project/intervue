package com.techx.intervue.modules.connect.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectMessageType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "connection_messages")
public class ConnectionMessage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "connection_id", nullable = false, updatable = false)
    private Long connectionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_type", nullable = false, updatable = false, length = 20)
    private ConnectActorType senderType;

    @Column(name = "sender_id", nullable = false, updatable = false)
    private Long senderId;

    @Column(name = "client_message_id", updatable = false, length = 64)
    private String clientMessageId;

    @Column(name = "reply_to_message_id", updatable = false)
    private Long replyToMessageId;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, length = 20)
    private ConnectMessageType messageType;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "attachment_public_id")
    private String attachmentPublicId;

    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Column(name = "attachment_file_name")
    private String attachmentFileName;

    @Column(name = "attachment_content_type", length = 100)
    private String attachmentContentType;

    @Column(name = "attachment_file_size_bytes")
    private Long attachmentFileSizeBytes;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "link_title")
    private String linkTitle;

    @Column(name = "link_description", length = 500)
    private String linkDescription;

    @Column(name = "link_image_url", length = 500)
    private String linkImageUrl;

    @Column(name = "edited_at")
    private Instant editedAt;

    @Column(name = "recalled_at")
    private Instant recalledAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "recalled_by_type", length = 20)
    private ConnectActorType recalledByType;

    @Column(name = "recalled_by_id")
    private Long recalledById;
}
