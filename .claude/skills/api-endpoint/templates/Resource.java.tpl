package com.techx.intervue.modules.${module}.resources;

import java.time.Instant;

public record ${Entity}Resource(Long id, String title, Instant createdAt) {

    public static ${Entity}Resource from(${Entity} entity) {
        return new ${Entity}Resource(entity.getId(), entity.getTitle(), entity.getCreatedAt());
    }
}
