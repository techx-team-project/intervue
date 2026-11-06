package com.techx.intervue.modules.candidate.services.impl;

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

    static final long MAX_BYTES = 5L * 1024L * 1024L;
    static final int MAX_PAGES = 5;

    private static final byte[] PDF_MAGIC = {0x25, 0x50, 0x44, 0x46};

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            reject(CvUnreadableReason.EMPTY_FILE);
        }
        if (file.getSize() > MAX_BYTES) {
            reject(CvUnreadableReason.FILE_SIZE_EXCEEDED);
        }
        byte[] content = read(file);
        if (!hasPdfHeader(content)) {
            reject(CvUnreadableReason.CORRUPTED_PDF);
        }
        try (PDDocument document = Loader.loadPDF(content)) {
            if (document.isEncrypted()) {
                reject(CvUnreadableReason.PASSWORD_PROTECTED);
            }
            int pages = document.getNumberOfPages();
            if (pages == 0) {
                reject(CvUnreadableReason.EMPTY_FILE);
            }
            if (pages > MAX_PAGES) {
                reject(CvUnreadableReason.PAGE_LIMIT_EXCEEDED);
            }
        } catch (InvalidPasswordException e) {
            reject(CvUnreadableReason.PASSWORD_PROTECTED);
        } catch (IOException e) {
            log.warn("Rejected a CV that PDFBox could not parse: {}", e.getMessage());
            reject(CvUnreadableReason.CORRUPTED_PDF);
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

    private boolean hasPdfHeader(byte[] content) {
        if (content.length < PDF_MAGIC.length) {
            return false;
        }
        for (int i = 0; i < PDF_MAGIC.length; i++) {
            if (content[i] != PDF_MAGIC[i]) {
                return false;
            }
        }
        return true;
    }

    private void reject(CvUnreadableReason reason) {
        throw AppException.validation("file", reason.getDefaultMessage());
    }
}
