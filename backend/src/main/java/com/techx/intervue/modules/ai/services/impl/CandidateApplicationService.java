package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import com.techx.intervue.modules.ai.services.interfaces.CandidateApplicationServiceInterface;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CandidateApplicationService implements CandidateApplicationServiceInterface {

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

    @Override
    public List<CandidateApplicationResult> getApplicationsByUserId(Long userId, int limit) {
        if (userId == null) {
            return List.of();
        }
        List<CandidateApplicationResult> list =
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
        return list.stream().limit(Math.max(1, limit)).toList();
    }
}
