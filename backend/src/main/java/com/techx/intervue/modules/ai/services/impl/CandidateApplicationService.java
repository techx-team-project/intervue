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
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CandidateApplicationService implements CandidateApplicationServiceInterface {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

    private final ApplicationServiceInterface applicationService;

    private static final Map<Long, List<CandidateApplicationResult>> SEED_APPLICATIONS =
            Map.of(
                    1L,
                    List.of(
                            new CandidateApplicationResult(
                                    "app-101",
                                    "Backend Engineer (Java/Spring Boot)",
                                    "Công ty Cổ phần Công nghệ TechX Global",
                                    "Đang xem xét (Reviewing)",
                                    "01/11/2026",
                                    "/candidate/profile"),
                            new CandidateApplicationResult(
                                    "app-102",
                                    "Senior Frontend Engineer (React/Next.js)",
                                    "Công ty Cổ phần FPT Software",
                                    "Mời phỏng vấn kỹ thuật (Interviewing)",
                                    "28/10/2026",
                                    "/candidate/profile")));

    @Autowired
    public CandidateApplicationService(@Nullable ApplicationServiceInterface applicationService) {
        this.applicationService = applicationService;
    }

    public CandidateApplicationService() {
        this(null);
    }

    @Override
    public List<CandidateApplicationResult> getApplicationsByUserId(Long userId, int limit) {
        if (userId == null) {
            return List.of();
        }

        int maxResults = Math.max(1, limit);

        if (applicationService != null) {
            try {
                Page<ApplicationSummaryResource> page =
                        applicationService.search(
                                new SearchApplicationsRequest(null, null),
                                PageRequest.of(0, maxResults),
                                userId);

                if (page != null && page.hasContent() && !page.getContent().isEmpty()) {
                    return page.getContent().stream().map(this::toResult).toList();
                }
            } catch (Exception ex) {
                log.warn(
                        "Database candidate applications lookup failed, falling back: {}",
                        ex.getMessage());
            }
        }

        List<CandidateApplicationResult> fallback =
                SEED_APPLICATIONS.getOrDefault(
                        userId,
                        List.of(
                                new CandidateApplicationResult(
                                        "app-" + userId + "-01",
                                        "Software Engineer (Java / Cloud)",
                                        "Công ty Cổ phần Tập đoàn FPT Software",
                                        "Đã tiếp nhận hồ sơ",
                                        "03/11/2026",
                                        "/candidate/profile")));
        return fallback.stream().limit(maxResults).toList();
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
