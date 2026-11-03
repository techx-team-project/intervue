package com.techx.intervue.common.storage;

import java.util.EnumSet;
import java.util.Set;

public enum StorageTarget {
    LEGAL_DOCUMENT(
            "authenticated", "raw", EnumSet.of(FileType.PDF, FileType.JPEG, FileType.PNG), true),
    IMAGE("upload", "image", EnumSet.of(FileType.JPEG, FileType.PNG), false);

    private final String deliveryType;
    private final String resourceType;
    private final Set<FileType> allowedTypes;
    private final boolean extensionInPublicId;

    StorageTarget(
            String deliveryType,
            String resourceType,
            Set<FileType> allowedTypes,
            boolean extensionInPublicId) {
        this.deliveryType = deliveryType;
        this.resourceType = resourceType;
        this.allowedTypes = allowedTypes;
        this.extensionInPublicId = extensionInPublicId;
    }

    public String deliveryType() {
        return deliveryType;
    }

    public String resourceType() {
        return resourceType;
    }

    public boolean allows(FileType type) {
        return allowedTypes.contains(type);
    }

    public boolean extensionInPublicId() {
        return extensionInPublicId;
    }
}
