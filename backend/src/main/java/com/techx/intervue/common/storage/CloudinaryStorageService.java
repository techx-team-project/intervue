package com.techx.intervue.common.storage;

import com.cloudinary.Cloudinary;
import com.techx.intervue.config.StorageProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.io.IOException;
import java.net.URI;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
public class CloudinaryStorageService implements StorageServiceInterface {

    private static final String SHA_256 = "SHA-256";

    private final ObjectProvider<Cloudinary> cloudinaryProvider;
    private final RestClient restClient;
    private final StorageProperties properties;

    public CloudinaryStorageService(
            ObjectProvider<Cloudinary> cloudinaryProvider,
            @Qualifier("cloudinaryRestClient") RestClient restClient,
            StorageProperties properties) {
        this.cloudinaryProvider = cloudinaryProvider;
        this.restClient = restClient;
        this.properties = properties;
    }

    @Override
    public StoredFile upload(MultipartFile file, StorageTarget target, String folder) {
        byte[] content = readContent(file);
        if (content.length > maxBytesFor(target)) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }

        FileType type =
                FileType.detect(content)
                        .filter(target::allows)
                        .orElseThrow(() -> new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE));

        String publicId = buildPublicId(folder, target, type);
        Map<String, Object> options =
                Map.of(
                        "public_id",
                        publicId,
                        "resource_type",
                        target.resourceType(),
                        "type",
                        target.deliveryType(),
                        "unique_filename",
                        false,
                        "use_filename",
                        false,
                        "overwrite",
                        false);
        try {
            cloudinary().uploader().upload(content, options);
        } catch (IOException | RuntimeException e) {
            log.error("Cloudinary upload failed for {}: {}", publicId, e.getMessage());
            throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
        }

        return StoredFile.builder()
                .publicId(publicId)
                .originalFileName(safeFileName(file.getOriginalFilename(), type))
                .contentType(type.contentType())
                .sizeInBytes(content.length)
                .checksumSha256(checksum(content))
                .build();
    }

    @Override
    public byte[] fetchDocument(String publicId, StorageTarget target) {
        // Streams through the backend on purpose: no Cloudinary URL ever reaches a browser, so a
        // leaked link cannot outlive the authorization check this request already passed.
        String url = signedDocumentUrl(publicId, target);
        try {
            byte[] content = restClient.get().uri(URI.create(url)).retrieve().body(byte[].class);
            if (content == null) {
                throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
            }
            return content;
        } catch (RestClientException e) {
            log.error("Cloudinary fetch failed for {}: {}", publicId, e.getMessage());
            throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
        }
    }

    @Override
    public String publicImageUrl(String publicId) {
        return cloudinary()
                .url()
                .resourceType(StorageTarget.IMAGE.resourceType())
                .type(StorageTarget.IMAGE.deliveryType())
                .secure(true)
                .generate(publicId);
    }

    @Override
    public void delete(String publicId, StorageTarget target) {
        Map<String, Object> options =
                Map.of(
                        "resource_type", target.resourceType(),
                        "type", target.deliveryType(),
                        "invalidate", true);
        try {
            cloudinary().uploader().destroy(publicId, options);
        } catch (IOException | RuntimeException e) {
            log.error("Cloudinary delete failed for {}: {}", publicId, e.getMessage());
            throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
        }
    }

    private String signedDocumentUrl(String publicId, StorageTarget target) {
        return cloudinary()
                .url()
                .resourceType(target.resourceType())
                .type(target.deliveryType())
                .signed(true)
                .secure(true)
                .generate(publicId);
    }

    private Cloudinary cloudinary() {
        Cloudinary client = cloudinaryProvider.getIfAvailable();
        if (client == null) {
            log.error("Cloudinary is not configured; set CLOUDINARY_URL to enable file storage");
            throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
        }
        return client;
    }

    private long maxBytesFor(StorageTarget target) {
        return switch (target) {
            case LEGAL_DOCUMENT, RESUME, IDENTITY_DOCUMENT ->
                    properties.maxDocumentSize().toBytes();
            case IMAGE -> properties.maxImageSize().toBytes();
        };
    }

    private String buildPublicId(String folder, StorageTarget target, FileType type) {
        String name = UUID.randomUUID().toString();
        String path = properties.rootFolder() + "/" + folder + "/" + name;
        return target.extensionInPublicId() ? path + "." + type.extension() : path;
    }

    private byte[] readContent(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw AppException.validation("file", "A file is required");
        }
        try {
            return file.getBytes();
        } catch (IOException e) {
            log.error("Could not read the uploaded file: {}", e.getMessage());
            throw new AppException(ErrorCode.STORAGE_UNAVAILABLE);
        }
    }

    private String safeFileName(String originalFileName, FileType type) {
        if (originalFileName == null || originalFileName.isBlank()) {
            return "document." + type.extension();
        }
        String stripped = originalFileName.replaceAll("[^A-Za-z0-9._-]", "_");
        return stripped.length() > 255 ? stripped.substring(stripped.length() - 255) : stripped;
    }

    private String checksum(byte[] content) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance(SHA_256).digest(content));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(SHA_256 + " is not available", e);
        }
    }
}
