package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import com.techx.intervue.modules.ai.services.interfaces.CandidateApplicationServiceInterface;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.requests.SearchApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationSummaryResource;
import com.techx.intervue.modules.application.services.interfaces.ApplicationServiceInterface;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateApplicationService implements CandidateApplicationServiceInterface {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

    private final ApplicationServiceInterface applicationService;

    @Override
    public List<CandidateApplicationResult> getApplicationsByUserId(Long userId, int limit) {
        if (userId == null) {
            return List.of();
        }
        return applicationService
                .search(
                        new SearchApplicationsRequest(null, null),
                        PageRequest.of(0, Math.max(1, limit)),
                        userId)
                .stream()
                .map(this::toResult)
                .toList();
    }

    private CandidateApplicationResult toResult(ApplicationSummaryResource app) {
        String statusLabel = translateStatus(app.status());
        String dateText =
                app.submittedAt() != null
                        ? DATE_FORMATTER.format(app.submittedAt())
                        : (app.updatedAt() != null
                                ? DATE_FORMATTER.format(app.updatedAt())
                                : "Gần đây");

        return new CandidateApplicationResult(
                String.valueOf(app.id()),
                app.jobTitle() != null ? app.jobTitle() : "Vị trí tuyển dụng",
                app.companyName() != null ? app.companyName() : "Doanh nghiệp tuyển dụng",
                statusLabel,
                dateText,
                "/candidate/profile");
    }

    private String translateStatus(ApplicationStatus status) {
        if (status == null) {
            return "Đã tiếp nhận";
        }
        return switch (status) {
            case DRAFT -> "Bản nháp (Chưa nộp)";
            case APPLIED -> "Đã nộp hồ sơ (Applied)";
            case VIEWED -> "Nhà tuyển dụng đã xem hồ sơ";
            case IN_REVIEW -> "Nhà tuyển dụng đang đánh giá (In Review)";
            case INTERVIEW -> "Mời phỏng vấn (Interview)";
            case OFFER -> "Được gửi lời mời nhận việc (Offer)";
            case HIRED -> "Trúng tuyển chính thức (Hired)";
            case REJECTED -> "Chưa phù hợp (Rejected)";
            case WITHDRAWN -> "Đã rút hồ sơ (Withdrawn)";
            case JOB_CLOSED -> "Vị trí đã đóng tuyển dụng";
        };
    }
}
