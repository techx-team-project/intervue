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

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, updatable = false, length = 20)
    private ConnectMessageType messageType;

    @Column(columnDefinition = "TEXT", updatable = false)
    private String body;

    @Column(name = "attachment_public_id", updatable = false)
    private String attachmentPublicId;

    @Column(name = "attachment_url", length = 500, updatable = false)
    private String attachmentUrl;

    @Column(name = "attachment_file_name", updatable = false)
    private String attachmentFileName;

    @Column(name = "attachment_content_type", length = 100, updatable = false)
    private String attachmentContentType;

    @Column(name = "attachment_file_size_bytes", updatable = false)
    private Long attachmentFileSizeBytes;

    @Column(name = "link_url", length = 500, updatable = false)
    private String linkUrl;

    @Column(name = "link_title", updatable = false)
    private String linkTitle;

    @Column(name = "link_description", length = 500, updatable = false)
    private String linkDescription;

    @Column(name = "link_image_url", length = 500, updatable = false)
    private String linkImageUrl;
}
