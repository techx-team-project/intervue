package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.FileType;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
public class CvPdfValidator {

    private static final long MAX_BYTES = CvTextExtractorService.MAX_FILE_SIZE_BYTES;
    private static final int MAX_PAGES = CvTextExtractorService.MAX_PAGES;

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            reject(CvUnreadableReason.EMPTY_FILE);
        }
        if (file.getSize() > MAX_BYTES) {
            reject(CvUnreadableReason.FILE_SIZE_EXCEEDED);
        }
        byte[] content = read(file);
        if (FileType.detect(content).filter(type -> type == FileType.PDF).isEmpty()) {
            reject(CvUnreadableReason.CORRUPTED_PDF);
        }
        int pages = countPages(content);
        if (pages == 0) {
            reject(CvUnreadableReason.EMPTY_FILE);
        }
        if (pages > MAX_PAGES) {
            reject(CvUnreadableReason.PAGE_LIMIT_EXCEEDED);
        }
    }

    private byte[] read(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            log.warn("Could not read an uploaded CV: {}", e.getMessage());
            reject(CvUnreadableReason.CORRUPTED_PDF);
            return new byte[0];
        }
    }

    // A PDF locked only against copying or printing still opens with an empty password.
    private int countPages(byte[] content) {
        try (PDDocument document = Loader.loadPDF(content)) {
            return document.getNumberOfPages();
        } catch (InvalidPasswordException e) {
            reject(CvUnreadableReason.PASSWORD_PROTECTED);
            return 0;
        } catch (IOException e) {
            log.warn("Could not parse an uploaded CV: {}", e.getMessage());
            reject(CvUnreadableReason.CORRUPTED_PDF);
            return 0;
        }
    }

    private void reject(CvUnreadableReason reason) {
        throw AppException.validation("file", reason.getDefaultMessage());
    }
}
