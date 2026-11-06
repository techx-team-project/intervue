package com.techx.intervue.modules.notification.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.notification.requests.CreateBroadcastRequest;
import com.techx.intervue.modules.notification.requests.SearchBroadcastRequest;
import com.techx.intervue.modules.notification.requests.UpdateBroadcastRequest;
import com.techx.intervue.modules.notification.resources.AdminBroadcastResource;
import com.techx.intervue.modules.notification.resources.AudiencePreviewResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminBroadcastServiceInterface {

    Page<AdminBroadcastResource> search(SearchBroadcastRequest request, Pageable pageable);

    AdminBroadcastResource getById(Long id);

    AdminBroadcastResource create(CreateBroadcastRequest request, RequestActor actor);

    AdminBroadcastResource update(Long id, UpdateBroadcastRequest request, RequestActor actor);

    void delete(Long id, RequestActor actor);

    AudiencePreviewResource previewAudience(Long id);

    AdminBroadcastResource send(Long id, RequestActor actor);

    AdminBroadcastResource cancel(Long id, RequestActor actor);

    int dispatchDueBroadcasts();
}
