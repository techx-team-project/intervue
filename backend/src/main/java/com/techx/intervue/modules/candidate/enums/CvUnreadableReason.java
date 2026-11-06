package com.techx.intervue.modules.candidate.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CvUnreadableReason {
    EMPTY_FILE("Tệp tin PDF trống hoặc không có nội dung."),
    FILE_SIZE_EXCEEDED("Tệp tin PDF vượt quá dung lượng cho phép (tối đa 5 MB)."),
    CORRUPTED_PDF("Tệp tin PDF bị hỏng hoặc sai định dạng, không thể đọc."),
    PASSWORD_PROTECTED("Tệp tin PDF có mật khẩu bảo vệ. Vui lòng gỡ mật khẩu trước khi tải lên."),
    PAGE_LIMIT_EXCEEDED("Tệp tin PDF vượt quá số trang cho phép (tối đa 5 trang)."),
    SCANNED_PDF(
            "Tệp tin PDF là dạng ảnh quét (scan), không chứa lớp văn bản để trích xuất nội dung."),
    NO_TEXT_FOUND("Không tìm thấy nội dung văn bản nào trong tệp tin PDF.");

    private final String defaultMessage;
}
