package com.techx.intervue.common.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageServiceInterface {

    StoredFile upload(MultipartFile file, StorageTarget target, String folder);

    StoredFile copy(String publicId, String originalFileName, StorageTarget target, String folder);

    byte[] fetchDocument(String publicId, StorageTarget target);

    String publicUrl(String publicId, StorageTarget target);

    default String publicImageUrl(String publicId) {
        return publicUrl(publicId, StorageTarget.IMAGE);
    }

    void delete(String publicId, StorageTarget target);
}
