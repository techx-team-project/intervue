package com.techx.intervue.modules.connect.services.interfaces;

import java.util.Optional;
import lombok.Builder;

public interface LinkPreviewServiceInterface {

    @Builder
    record LinkPreview(String url, String title, String description, String imageUrl) {}

    Optional<LinkPreview> resolve(String text);
}
