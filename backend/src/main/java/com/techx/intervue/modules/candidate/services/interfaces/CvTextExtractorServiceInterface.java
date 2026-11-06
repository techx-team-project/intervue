package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import java.io.InputStream;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

public interface CvTextExtractorServiceInterface {

    CvTextExtractionResult extractText(byte[] pdfBytes);

    CvTextExtractionResult extractText(InputStream inputStream);

    CvTextExtractionResult extractText(MultipartFile file);

    Optional<CvTextExtractionResult> getCachedResult(String fileHash);

    void evictCache(String fileHash);

    String calculateHash(byte[] pdfBytes);
}
