package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.resources.SkillResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class JobSearchService implements JobSearchServiceInterface {

    private final PublicJobServiceInterface publicJobService;

    private static final List<JobSearchResult> CATALOG =
            List.of(
                    new JobSearchResult(
                            "201",
                            "Senior Java Backend Engineer (Remote - TP. HCM)",
                            "Công ty Cổ phần Công nghệ TechX Global",
                            "30 - 55 triệu VNĐ",
                            "TP. Hồ Chí Minh · 100% Remote",
                            "Senior",
                            List.of(
                                    "Java",
                                    "Spring Boot",
                                    "MySQL",
                                    "Redis",
                                    "Microservices",
                                    "Docker",
                                    "AWS",
                                    "Kafka"),
                            "Thiết kế và phát triển kiến trúc Microservices hiệu năng cao bằng Java và Spring Boot. Hỗ trợ chế độ làm việc 100% Remote tại TP. Hồ Chí Minh.",
                            "/jobs/201"),
                    new JobSearchResult(
                            "202",
                            "Java Software Engineer (Microservices / Cloud - Remote)",
                            "Công ty Cổ phần VNG (VNG Corporation)",
                            "25 - 45 triệu VNĐ",
                            "TP. Hồ Chí Minh · Remote",
                            "Mid",
                            List.of(
                                    "Java",
                                    "Spring Boot",
                                    "PostgreSQL",
                                    "Kafka",
                                    "Redis",
                                    "Docker",
                                    "Microservices"),
                            "Phát triển hệ thống phân tán và dịch vụ thanh toán số quy mô lớn trên nền tảng Java 21/25. Làm việc từ xa Remote linh hoạt tại TP. Hồ Chí Minh.",
                            "/jobs/202"),
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

    @Autowired
    public JobSearchService(@Nullable PublicJobServiceInterface publicJobService) {
        this.publicJobService = publicJobService;
    }

    public JobSearchService() {
        this(null);
    }

    @Override
    public List<JobSearchResult> search(String keyword, String level, String location, int limit) {
        int maxResults = Math.min(Math.max(1, limit), 20);

        if (publicJobService != null) {
            try {
                JobLevel jobLevel = parseLevel(level);
                String q = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
                String city = (location != null && !location.isBlank()) ? location.trim() : null;

                SearchJobsRequest request =
                        new SearchJobsRequest(
                                q, city, null, null, null, jobLevel, null, null, null);
                Page<PublicJobSummaryResource> page =
                        publicJobService.search(request, PageRequest.of(0, maxResults));

                if (page != null && page.hasContent() && !page.getContent().isEmpty()) {
                    return page.getContent().stream().map(this::toSearchResult).toList();
                }
            } catch (Exception ex) {
                log.warn(
                        "Database job search encountered an error, falling back: {}",
                        ex.getMessage());
            }
        }

        return searchCatalogFallback(keyword, level, location, maxResults);
    }

    private JobSearchResult toSearchResult(PublicJobSummaryResource job) {
        String salaryText = "Negotiable";
        if (job.salary() != null) {
            if (job.salary().negotiable()) {
                salaryText = "Negotiable";
            } else if (job.salary().min() != null && job.salary().max() != null) {
                salaryText =
                        String.format(
                                "%,d - %,d %s",
                                job.salary().min(),
                                job.salary().max(),
                                job.salary().currency() != null ? job.salary().currency() : "VND");
            } else if (job.salary().min() != null) {
                salaryText =
                        String.format(
                                "From %,d %s",
                                job.salary().min(),
                                job.salary().currency() != null ? job.salary().currency() : "VND");
            }
        }

        List<String> skills =
                job.skills() != null
                        ? job.skills().stream().map(SkillResource::name).toList()
                        : List.of();

        String companyName =
                job.company() != null && job.company().name() != null
                        ? job.company().name()
                        : "Partner company";

        return new JobSearchResult(
                String.valueOf(job.id()),
                job.title(),
                companyName,
                salaryText,
                job.city() != null ? job.city() : "Nationwide",
                job.level() != null ? job.level().name() : "All levels",
                skills,
                "Open job post at " + companyName + ". View the requirements and apply.",
                "/jobs/" + job.id());
    }

    private JobLevel parseLevel(String level) {
        if (level == null || level.isBlank()) {
            return null;
        }
        String clean = level.trim().toUpperCase(Locale.ROOT);
        try {
            return JobLevel.valueOf(clean);
        } catch (IllegalArgumentException ex) {
            return switch (clean) {
                case "FRESHER", "INTERNSHIP" -> JobLevel.INTERN;
                case "JUNIOR DEVELOPER" -> JobLevel.JUNIOR;
                case "MIDDLE", "MID-LEVEL" -> JobLevel.MID;
                case "TECH LEAD", "TEAM LEAD" -> JobLevel.LEAD;
                default -> null;
            };
        }
    }

    private List<JobSearchResult> searchCatalogFallback(
            String keyword, String level, String location, int maxResults) {
        if ((keyword == null || keyword.isBlank())
                && (location == null || location.isBlank())
                && (level == null || level.isBlank())) {
            return CATALOG.stream().limit(maxResults).toList();
        }

        String normalizedKeyword = normalize(keyword);
        String normalizedLevel = level != null ? normalize(level) : null;
        String normalizedLocation = location != null ? normalizeLocation(location) : null;

        List<JobSearchResult> matches = new ArrayList<>();

        for (JobSearchResult job : CATALOG) {
            if (!matchesFilter(job, normalizedKeyword, normalizedLevel, normalizedLocation)) {
                continue;
            }
            matches.add(job);
            if (matches.size() >= maxResults) {
                break;
            }
        }

        if (matches.isEmpty() && normalizedKeyword != null && !normalizedKeyword.isBlank()) {
            for (JobSearchResult job : CATALOG) {
                if (matchesAny(job, normalizedKeyword)) {
                    matches.add(job);
                    if (matches.size() >= maxResults) {
                        break;
                    }
                }
            }
        }

        return matches;
    }

    private boolean matchesFilter(
            JobSearchResult job,
            String normalizedKeyword,
            String normalizedLevel,
            String normalizedLocation) {
        if (normalizedKeyword != null && !normalizedKeyword.isBlank()) {
            if (!matchesAny(job, normalizedKeyword)) {
                return false;
            }
        }

        if (normalizedLevel != null && !normalizedLevel.isBlank()) {
            String jobLevel = normalize(job.level());
            if (!jobLevel.contains(normalizedLevel) && !normalizedLevel.contains(jobLevel)) {
                return false;
            }
        }

        if (normalizedLocation != null && !normalizedLocation.isBlank()) {
            String jobLoc = normalizeLocation(job.location());
            if (!jobLoc.contains(normalizedLocation) && !normalizedLocation.contains(jobLoc)) {
                return false;
            }
        }

        return true;
    }

    private boolean matchesAny(JobSearchResult job, String normalizedKeyword) {
        if (normalizedKeyword == null || normalizedKeyword.isBlank()) {
            return true;
        }
        String titleNorm = normalize(job.title());
        String descNorm = normalize(job.description());
        String locNorm = normalize(job.location());
        String fullJobText = titleNorm + " " + descNorm + " " + locNorm;

        if (titleNorm.contains(normalizedKeyword)
                || descNorm.contains(normalizedKeyword)
                || locNorm.contains(normalizedKeyword)) {
            return true;
        }
        for (String skill : job.skills()) {
            String normSkill = normalize(skill);
            if (normSkill.contains(normalizedKeyword) || normalizedKeyword.contains(normSkill)) {
                return true;
            }
        }

        String[] tokens = normalizedKeyword.split("\\s+");
        boolean allTokensMatch = true;
        boolean hasMeaningfulToken = false;
        for (String token : tokens) {
            if (token.isBlank() || isStopWord(token)) {
                continue;
            }
            hasMeaningfulToken = true;
            boolean tokenMatches = fullJobText.contains(token);
            if (!tokenMatches) {
                for (String skill : job.skills()) {
                    if (normalize(skill).contains(token) || token.contains(normalize(skill))) {
                        tokenMatches = true;
                        break;
                    }
                }
            }
            if (!tokenMatches) {
                allTokensMatch = false;
                break;
            }
        }

        return hasMeaningfulToken && allTokensMatch;
    }

    private boolean isStopWord(String word) {
        return word.equals("find")
                || word.equals("job")
                || word.equals("jobs")
                || word.equals("in")
                || word.equals("at")
                || word.equals("for")
                || word.equals("city")
                || word.equals("tp")
                || word.equals("tim")
                || word.equals("viec")
                || word.equals("lam")
                || word.equals("o")
                || word.equals("tai");
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

    private String normalizeLocation(String location) {
        if (location == null) return "";
        String norm = normalize(location);
        if (norm.contains("ho chi minh") || norm.contains("hcm") || norm.contains("sai gon")) {
            return "ho chi minh";
        }
        if (norm.contains("ha noi") || norm.contains("hn")) {
            return "ha noi";
        }
        if (norm.contains("da nang")) {
            return "da nang";
        }
        return norm;
    }
}
