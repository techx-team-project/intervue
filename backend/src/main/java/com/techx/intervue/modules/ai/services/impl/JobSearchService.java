package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class JobSearchService implements JobSearchServiceInterface {

    private static final List<JobSearchResult> CATALOG =
            List.of(
                    new JobSearchResult(
                            "103",
                            "Senior Backend Engineer (Node.js / TypeScript / Microservices)",
                            "Tập đoàn Công nghệ Viettel (Viettel Digital)",
                            "25 - 45 triệu VNĐ",
                            "Hà Nội (Cầu Giấy) · Hybrid",
                            "Senior",
                            List.of(
                                    "Node.js",
                                    "NodeJS",
                                    "TypeScript",
                                    "NestJS",
                                    "Express",
                                    "Microservices",
                                    "PostgreSQL",
                                    "Redis"),
                            "Thiết kế và phát triển các dịch vụ backend phục vụ hệ sinh thái thanh toán và số hóa với Node.js, TypeScript và NestJS.",
                            "/jobs/103"),
                    new JobSearchResult(
                            "302",
                            "Fullstack Developer (Node.js / React.js / Next.js)",
                            "Công ty Cổ phần FPT Software",
                            "20 - 35 triệu VNĐ",
                            "Hà Nội & TP. HCM · Hybrid",
                            "Mid",
                            List.of(
                                    "Node.js",
                                    "NodeJS",
                                    "React",
                                    "Next.js",
                                    "TypeScript",
                                    "REST API",
                                    "MongoDB"),
                            "Tham gia phát triển các tính năng Fullstack từ giao diện React/Next.js đến hệ thống API backend Node.js.",
                            "/jobs/302"),
                    new JobSearchResult(
                            "301",
                            "Technical Architect Java / Microservices / Cloud AWS",
                            "Công ty Cổ phần FPT Software",
                            "45 - 75 triệu VNĐ",
                            "Hà Nội (Hòa Lạc)",
                            "Architect",
                            List.of(
                                    "Java",
                                    "Spring Boot",
                                    "Microservices",
                                    "Cloud",
                                    "AWS",
                                    "Backend"),
                            "Thiết kế kiến trúc kỹ thuật tổng thể cho các giải pháp phần mềm quy mô Enterprise, giải quyết bài toán tải cao.",
                            "/jobs/301"),
                    new JobSearchResult(
                            "5",
                            "Senior Frontend Engineer (React.js / Next.js / TypeScript)",
                            "Công ty Cổ phần FPT Software",
                            "30 - 50 triệu VNĐ",
                            "Hà Nội & TP. HCM",
                            "Senior",
                            List.of("React", "Next.js", "TypeScript", "Frontend", "Tailwind CSS"),
                            "Phát triển các ứng dụng Web quy mô lớn với React, Next.js, tối ưu hóa tốc độ tải trang và trải nghiệm người dùng.",
                            "/jobs/5"),
                    new JobSearchResult(
                            "101",
                            "Senior Cloud & DevOps Infrastructure Architect (Viettel Cloud)",
                            "Tổng Công ty Giải pháp Doanh nghiệp Viettel (VTS)",
                            "35 - 55 triệu VNĐ",
                            "Hà Nội (Cầu Giấy)",
                            "Senior",
                            List.of(
                                    "DevOps",
                                    "Cloud",
                                    "Kubernetes",
                                    "Docker",
                                    "AWS",
                                    "CI/CD",
                                    "Linux"),
                            "Thiết kế kiến trúc hạ tầng Cloud quy mô lớn, vận hành cụm Kubernetes đa vùng (Multi-cluster).",
                            "/jobs/101"),
                    new JobSearchResult(
                            "401",
                            "Data Engineer & Big Data Platform Specialist",
                            "Ngân Hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
                            "30 - 50 triệu VNĐ",
                            "Hà Nội (Hoàn Kiếm)",
                            "Mid",
                            List.of("Data Engineer", "Python", "SQL", "Spark", "Kafka", "Big Data"),
                            "Xây dựng và bảo trì các Data Pipeline xử lý dữ liệu lớn thời gian thực cho nền tảng ngân hàng số.",
                            "/jobs/401"),
                    new JobSearchResult(
                            "102",
                            "Chuyên Viên Phân Tích & Giám Sát An Ninh Mạng SOC (Cyber Security)",
                            "Công ty An ninh mạng Viettel (VCS)",
                            "25 - 45 triệu VNĐ",
                            "Hà Nội (Cầu Giấy)",
                            "Mid",
                            List.of(
                                    "An ninh mạng",
                                    "Security",
                                    "SOC",
                                    "SIEM",
                                    "Threat Intelligence"),
                            "Phát hiện và phản ứng trước các cuộc tấn công mạng, phân tích mã độc và điều tra sự cố bảo mật.",
                            "/jobs/102"),
                    new JobSearchResult(
                            "501",
                            "Game Server Developer (C++ / Go / Distributed Systems)",
                            "Tập đoàn VNG (VNG Games)",
                            "25 - 45 triệu VNĐ",
                            "TP. Hồ Chí Minh (Quận 7)",
                            "Mid",
                            List.of("Golang", "Go", "C++", "Game", "Backend", "Socket"),
                            "Phát triển hệ thống Server Game Multiplayer thời gian thực cho hàng trăm nghìn người chơi đồng thời.",
                            "/jobs/501"));

    @Override
    public List<JobSearchResult> search(String keyword, String level, String location, int limit) {
        if (keyword == null || keyword.isBlank()) {
            return CATALOG.stream().limit(Math.max(1, limit)).toList();
        }

        String normalizedKeyword = normalize(keyword);
        String normalizedLevel = level != null ? normalize(level) : null;
        String normalizedLocation = location != null ? normalize(location) : null;

        List<JobSearchResult> matches = new ArrayList<>();

        for (JobSearchResult job : CATALOG) {
            boolean skillMatch = matchesAny(job, normalizedKeyword);
            if (!skillMatch) {
                continue;
            }

            if (normalizedLevel != null && !normalizedLevel.isBlank()) {
                String jobLevel = normalize(job.level());
                if (!jobLevel.contains(normalizedLevel) && !normalizedLevel.contains(jobLevel)) {
                    continue;
                }
            }

            if (normalizedLocation != null && !normalizedLocation.isBlank()) {
                String jobLoc = normalize(job.location());
                if (!jobLoc.contains(normalizedLocation) && !normalizedLocation.contains(jobLoc)) {
                    continue;
                }
            }

            matches.add(job);
            if (matches.size() >= limit) {
                break;
            }
        }

        if (matches.isEmpty() && (normalizedLevel != null || normalizedLocation != null)) {
            for (JobSearchResult job : CATALOG) {
                if (matchesAny(job, normalizedKeyword)) {
                    matches.add(job);
                    if (matches.size() >= limit) {
                        break;
                    }
                }
            }
        }

        return matches;
    }

    private boolean matchesAny(JobSearchResult job, String normalizedKeyword) {
        if (normalize(job.title()).contains(normalizedKeyword)) {
            return true;
        }
        for (String skill : job.skills()) {
            String normSkill = normalize(skill);
            if (normSkill.contains(normalizedKeyword) || normalizedKeyword.contains(normSkill)) {
                return true;
            }
        }
        return normalize(job.description()).contains(normalizedKeyword);
    }

    private String normalize(String value) {
        if (value == null) return "";
        return value.toLowerCase(Locale.ROOT)
                .replace(".", "")
                .replace("-", "")
                .replace("/", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}
