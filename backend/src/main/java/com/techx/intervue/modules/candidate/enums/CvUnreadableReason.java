package com.techx.intervue.modules.candidate.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CvUnreadableReason {
    EMPTY_FILE("The PDF is empty or has no content."),
    FILE_SIZE_EXCEEDED("The PDF is larger than the allowed 5 MB."),
    CORRUPTED_PDF("The PDF is damaged or not a valid PDF, so it cannot be read."),
    PASSWORD_PROTECTED(
            "The PDF needs a password to open. Remove the password and upload it again."),
    PAGE_LIMIT_EXCEEDED("The PDF has more than the allowed 5 pages."),
    SCANNED_PDF("The PDF is a scanned image with no text layer to read."),
    NO_TEXT_FOUND("No text was found in the PDF.");

    private final String defaultMessage;
}
