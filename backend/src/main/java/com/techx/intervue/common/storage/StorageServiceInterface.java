package com.techx.intervue.common.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageServiceInterface {

    StoredFile upload(MultipartFile file, StorageTarget target, String folder);

    byte[] fetchDocument(String publicId, StorageTarget target);

    String publicImageUrl(String publicId);

    void delete(String publicId, StorageTarget target);
}
