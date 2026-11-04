package com.techx.intervue.common.storage;

import lombok.Builder;

@Builder
public record StoredFile(
        String publicId,
        String originalFileName,
        String contentType,
        long sizeInBytes,
        String checksumSha256) {}
