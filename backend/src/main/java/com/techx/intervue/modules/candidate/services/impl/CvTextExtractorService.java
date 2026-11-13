package com.techx.intervue.modules.candidate.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.common.storage.FileType;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CvTextExtractorService implements CvTextExtractorServiceInterface {

    private static final String CACHE_KEY_PREFIX = "cv:text:cache:v2:";
    private static final Duration CACHE_TTL = Duration.ofDays(30);

    public static final long MAX_FILE_SIZE_BYTES = 5L * 1024L * 1024L;
    public static final int MAX_PAGES = 5;

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final CvTextCleaner cvTextCleaner;

    @Override
    public CvTextExtractionResult extractText(byte[] pdfBytes) {
        if (pdfBytes == null || pdfBytes.length == 0) {
            return CvTextExtractionResult.unreadable("", CvUnreadableReason.EMPTY_FILE, 0, false);
        }

        String fileHash = calculateHash(pdfBytes);

        Optional<CvTextExtractionResult> cached = getCachedResult(fileHash);
        if (cached.isPresent()) {
            return cached.get();
        }

        CvTextExtractionResult result = doExtract(pdfBytes, fileHash);
        cacheResult(fileHash, result);
        return result;
    }

    @Override
    public CvTextExtractionResult extractText(InputStream inputStream) {
        if (inputStream == null) {
            return CvTextExtractionResult.unreadable("", CvUnreadableReason.EMPTY_FILE, 0, false);
        }
        try {
            byte[] bytes = inputStream.readAllBytes();
            return extractText(bytes);
        } catch (IOException e) {
            log.warn("Failed to read PDF input stream: {}", e.getMessage());
            return CvTextExtractionResult.unreadable(
                    "", CvUnreadableReason.CORRUPTED_PDF, 0, false);
        }
    }

    @Override
    public CvTextExtractionResult extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return CvTextExtractionResult.unreadable("", CvUnreadableReason.EMPTY_FILE, 0, false);
        }
        try {
            byte[] bytes = file.getBytes();
            return extractText(bytes);
        } catch (IOException e) {
            log.warn("Failed to read uploaded multipart file: {}", e.getMessage());
            return CvTextExtractionResult.unreadable(
                    "", CvUnreadableReason.CORRUPTED_PDF, 0, false);
        }
    }

    @Override
    public Optional<CvTextExtractionResult> getCachedResult(String fileHash) {
        if (fileHash == null || fileHash.isBlank() || redisTemplate == null) {
            return Optional.empty();
        }
        try {
            String key = CACHE_KEY_PREFIX + fileHash;
            String cachedJson = redisTemplate.opsForValue().get(key);
            if (cachedJson != null && !cachedJson.isBlank()) {
                CvTextExtractionResult result =
                        objectMapper.readValue(cachedJson, CvTextExtractionResult.class);
                return Optional.of(result.withFromCache(true));
            }
        } catch (Exception e) {
            log.warn("Failed to retrieve cached CV text for hash {}: {}", fileHash, e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public void evictCache(String fileHash) {
        if (fileHash == null || fileHash.isBlank() || redisTemplate == null) {
            return;
        }
        try {
            redisTemplate.delete(CACHE_KEY_PREFIX + fileHash);
        } catch (Exception e) {
            log.warn("Failed to evict cached CV text for hash {}: {}", fileHash, e.getMessage());
        }
    }

    @Override
    public String calculateHash(byte[] pdfBytes) {
        if (pdfBytes == null || pdfBytes.length == 0) {
            return "";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(pdfBytes);
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    private CvTextExtractionResult doExtract(byte[] pdfBytes, String fileHash) {
        if (pdfBytes.length > MAX_FILE_SIZE_BYTES) {
            return CvTextExtractionResult.unreadable(
                    fileHash, CvUnreadableReason.FILE_SIZE_EXCEEDED, 0, false);
        }

        if (FileType.detect(pdfBytes).filter(type -> type == FileType.PDF).isEmpty()) {
            return CvTextExtractionResult.unreadable(
                    fileHash, CvUnreadableReason.CORRUPTED_PDF, 0, false);
        }

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            int pageCount = document.getNumberOfPages();
            if (pageCount == 0) {
                return CvTextExtractionResult.unreadable(
                        fileHash, CvUnreadableReason.EMPTY_FILE, 0, false);
            }

            if (pageCount > MAX_PAGES) {
                return CvTextExtractionResult.unreadable(
                        fileHash, CvUnreadableReason.PAGE_LIMIT_EXCEEDED, pageCount, false);
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String rawText = stripper.getText(document);

            String cleanedText = cvTextCleaner.clean(rawText);
            if (cleanedText.isBlank() || cvTextCleaner.isLikelyScanned(cleanedText)) {
                return CvTextExtractionResult.unreadable(
                        fileHash, CvUnreadableReason.SCANNED_PDF, pageCount, false);
            }

            return CvTextExtractionResult.readable(fileHash, cleanedText, pageCount, false);
        } catch (InvalidPasswordException e) {
            return CvTextExtractionResult.unreadable(
                    fileHash, CvUnreadableReason.PASSWORD_PROTECTED, 0, false);
        } catch (IOException e) {
            log.warn("Failed to load or parse PDF document: {}", e.getMessage());
            return CvTextExtractionResult.unreadable(
                    fileHash, CvUnreadableReason.CORRUPTED_PDF, 0, false);
        }
    }

    private void cacheResult(String fileHash, CvTextExtractionResult result) {
        if (fileHash == null || fileHash.isBlank() || redisTemplate == null) {
            return;
        }
        try {
            String key = CACHE_KEY_PREFIX + fileHash;
            String json = objectMapper.writeValueAsString(result);
            redisTemplate.opsForValue().set(key, json, CACHE_TTL);
        } catch (JsonProcessingException e) {
            log.warn(
                    "Failed to serialize CV extraction result for hash {}: {}",
                    fileHash,
                    e.getMessage());
        } catch (Exception e) {
            log.warn(
                    "Failed to write CV extraction result to Redis for hash {}: {}",
                    fileHash,
                    e.getMessage());
        }
    }
}
