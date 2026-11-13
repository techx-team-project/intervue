package com.techx.intervue.common.storage;

import java.util.Arrays;
import java.util.Optional;

public enum FileType {
    PDF("application/pdf", "pdf", new byte[] {0x25, 0x50, 0x44, 0x46}),
    JPEG("image/jpeg", "jpg", new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}),
    PNG("image/png", "png", new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A});

    // The PDF spec lets the %PDF header sit anywhere in the first 1024 bytes.
    private static final int PDF_HEADER_WINDOW = 1024;

    private final String contentType;
    private final String extension;
    private final byte[] signature;

    FileType(String contentType, String extension, byte[] signature) {
        this.contentType = contentType;
        this.extension = extension;
        this.signature = signature;
    }

    public String contentType() {
        return contentType;
    }

    public String extension() {
        return extension;
    }

    public static Optional<FileType> detect(byte[] content) {
        return Arrays.stream(values()).filter(type -> type.matches(content)).findFirst();
    }

    private boolean matches(byte[] content) {
        int window = Math.min(content.length, this == PDF ? PDF_HEADER_WINDOW : signature.length);
        for (int offset = 0; offset + signature.length <= window; offset++) {
            if (Arrays.equals(
                    content, offset, offset + signature.length, signature, 0, signature.length)) {
                return true;
            }
        }
        return false;
    }
}
