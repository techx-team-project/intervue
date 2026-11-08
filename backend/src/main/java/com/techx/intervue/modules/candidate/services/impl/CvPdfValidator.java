package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
public class CvPdfValidator {

    private static final long MAX_BYTES = 5L * 1024L * 1024L;
    private static final byte[] PDF_MAGIC = {0x25, 0x50, 0x44, 0x46};

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            reject(CvUnreadableReason.EMPTY_FILE);
        }
        if (file.getSize() > MAX_BYTES) {
            reject(CvUnreadableReason.FILE_SIZE_EXCEEDED);
        }
        if (!startsWithPdfSignature(file)) {
            reject(CvUnreadableReason.CORRUPTED_PDF);
        }
    }

    private boolean startsWithPdfSignature(MultipartFile file) {
        try {
            byte[] content = file.getBytes();
            if (content.length < PDF_MAGIC.length) {
                return false;
            }
            for (int i = 0; i < PDF_MAGIC.length; i++) {
                if (content[i] != PDF_MAGIC[i]) {
                    return false;
                }
            }
            return true;
        } catch (IOException e) {
            log.warn("Could not read an uploaded CV: {}", e.getMessage());
            return false;
        }
    }

    private void reject(CvUnreadableReason reason) {
        throw AppException.validation("file", reason.getDefaultMessage());
    }
}
