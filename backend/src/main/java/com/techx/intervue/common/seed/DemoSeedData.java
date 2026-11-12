package com.techx.intervue.common.seed;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class DemoSeedData {

    public static final String PASSWORD = "Demo@123";
    public static final long RANDOM_SEED = 20261112L;
    public static final int FAKE_CANDIDATES = 36;
    public static final int JOB_COUNT = 160;
    public static final String FAKE_EMAIL_DOMAIN = "intervue.test";

    private static String logo(String file) {
        return "/company-logos/" + file;
    }

    public record OwnerAccount(String name, String email) {}

    public record DemoCompany(String tradingName, String industry, String city, String logoFile) {}

    public record CandidateRole(String title, List<String> skills) {}

    public record JobSpec(String title, String level, List<String> skills) {}

    public record City(String name, double latitude, double longitude) {}

    public record ScreeningQuestion(
            String type, String prompt, List<String> options, boolean required) {}

    public static final List<OwnerAccount> OWNERS =
            List.of(
                    new OwnerAccount("Phạm Hoàng Tuấn", "phamhoangtuanqn@gmail.com"),
                    new OwnerAccount("Mai Trung Hậu", "chunhau.py@gmail.com"),
                    new OwnerAccount("Lê Minh Trí", "leminhtri260903@gmail.com"),
                    new OwnerAccount("Lâm Hoàng An", "lamhoangan612@gmail.com"));

    public static final List<DemoCompany> COMPANIES =
            List.of(
                    new DemoCompany(
                            "Viettel Solutions",
                            "Software & telecom solutions",
                            "Hà Nội",
                            logo("viettel-solutions.svg")),
                    new DemoCompany(
                            "Grab Vietnam",
                            "Super app, ride-hailing & delivery",
                            "TP. Hồ Chí Minh",
                            logo("grab-vietnam.svg")),
                    new DemoCompany(
                            "FPT Software",
                            "Software outsourcing",
                            "Hà Nội",
                            logo("fpt-software.svg")),
                    new DemoCompany("Tiki", "E-commerce", "TP. Hồ Chí Minh", logo("tiki.png")),
                    new DemoCompany(
                            "Shopee Vietnam",
                            "E-commerce",
                            "TP. Hồ Chí Minh",
                            logo("shopee-vietnam.svg")),
                    new DemoCompany(
                            "Lazada Vietnam",
                            "E-commerce",
                            "TP. Hồ Chí Minh",
                            logo("lazada-vietnam.png")),
                    new DemoCompany(
                            "Vingroup",
                            "Technology & industrial conglomerate",
                            "Hà Nội",
                            logo("vingroup.svg")),
                    new DemoCompany(
                            "Sacombank",
                            "Digital banking",
                            "TP. Hồ Chí Minh",
                            logo("sacombank.png")),
                    new DemoCompany("BIDV", "Banking & fintech", "Hà Nội", logo("bidv.svg")),
                    new DemoCompany(
                            "Techcombank", "Digital banking", "Hà Nội", logo("techcombank.png")),
                    new DemoCompany("VPBank", "Digital banking", "Hà Nội", logo("vpbank.svg")),
                    new DemoCompany(
                            "VinAI", "Artificial intelligence", "Hà Nội", logo("vinai.png")),
                    new DemoCompany("MISA", "Accounting software", "Hà Nội", logo("misa.jpg")),
                    new DemoCompany(
                            "FPT Telecom",
                            "Telecommunications",
                            "Đà Nẵng",
                            logo("fpt-telecom.svg")),
                    new DemoCompany(
                            "Zalo Group",
                            "Social network & messaging",
                            "TP. Hồ Chí Minh",
                            logo("zalo-group.png")),
                    new DemoCompany(
                            "Intel Vietnam",
                            "Semiconductors & hardware",
                            "TP. Hồ Chí Minh",
                            logo("intel.svg")),
                    new DemoCompany(
                            "LG Electronics Vietnam",
                            "Consumer electronics & software",
                            "Hà Nội",
                            logo("lg-electronics.svg")),
                    new DemoCompany(
                            "Accenture Vietnam",
                            "IT consulting & services",
                            "TP. Hồ Chí Minh",
                            logo("accenture.svg")),
                    new DemoCompany(
                            "Oracle Vietnam",
                            "Enterprise software & cloud",
                            "Hà Nội",
                            logo("oracle.svg")),
                    new DemoCompany(
                            "Cisco Vietnam", "Networking & security", "Hà Nội", logo("cisco.svg")),
                    new DemoCompany(
                            "Siemens Vietnam",
                            "Industrial automation & software",
                            "TP. Hồ Chí Minh",
                            logo("siemens.svg")),
                    new DemoCompany(
                            "Nokia Vietnam",
                            "Telecom equipment & networks",
                            "Hà Nội",
                            logo("nokia.svg")),
                    new DemoCompany(
                            "Ericsson Vietnam",
                            "Telecom networks & 5G",
                            "Hà Nội",
                            logo("ericsson.svg")),
                    new DemoCompany(
                            "Toshiba Vietnam",
                            "Electronics & embedded software",
                            "TP. Hồ Chí Minh",
                            logo("toshiba.svg")),
                    new DemoCompany(
                            "NTT Data Vietnam",
                            "IT services & consulting",
                            "Hà Nội",
                            logo("ntt-data.svg")),
                    new DemoCompany(
                            "Fujitsu Vietnam",
                            "IT services & digital transformation",
                            "Đà Nẵng",
                            logo("fujitsu.svg")),
                    new DemoCompany(
                            "Mercari Vietnam", "Online marketplace", "Hà Nội", logo("mercari.svg")),
                    new DemoCompany(
                            "LINE Vietnam",
                            "Messaging & digital services",
                            "Đà Nẵng",
                            logo("line.svg")),
                    new DemoCompany(
                            "Shopify",
                            "E-commerce platform",
                            "TP. Hồ Chí Minh",
                            logo("shopify.svg")),
                    new DemoCompany(
                            "Atlassian",
                            "Collaboration software",
                            "TP. Hồ Chí Minh",
                            logo("atlassian.png")),
                    new DemoCompany(
                            "Zalando",
                            "Fashion e-commerce platform",
                            "Hà Nội",
                            logo("zalando.svg")),
                    new DemoCompany(
                            "Booking.com", "Online travel", "TP. Hồ Chí Minh", logo("booking.svg")),
                    new DemoCompany(
                            "Traveloka", "Online travel", "TP. Hồ Chí Minh", logo("traveloka.png")),
                    new DemoCompany(
                            "Infosys Vietnam", "IT services", "Hà Nội", logo("infosys.svg")),
                    new DemoCompany(
                            "Tata Consultancy Services",
                            "IT services",
                            "TP. Hồ Chí Minh",
                            logo("tcs.svg")),
                    new DemoCompany(
                            "Deloitte Vietnam",
                            "Consulting & technology",
                            "TP. Hồ Chí Minh",
                            logo("deloitte.svg")),
                    new DemoCompany(
                            "Gojek Vietnam",
                            "Super app & fintech",
                            "TP. Hồ Chí Minh",
                            logo("gojek.svg")),
                    new DemoCompany(
                            "Google Vietnam",
                            "Internet & cloud services",
                            "TP. Hồ Chí Minh",
                            logo("google.svg")),
                    new DemoCompany(
                            "Panasonic Vietnam",
                            "Electronics & IoT",
                            "Hà Nội",
                            logo("panasonic.svg")),
                    new DemoCompany(
                            "Hitachi Vietnam",
                            "Digital & industrial solutions",
                            "Hà Nội",
                            logo("hitachi.svg")));

    public static final int APPROVED_COMPANIES = 34;
    public static final List<String> COMPANY_SIZES =
            List.of("51-200", "201-500", "501-1000", "1000+");
    public static final List<String> COMPANY_STREETS =
            List.of("Lê Lợi", "Nguyễn Trãi", "Hai Bà Trưng");

    public static final List<String> LAST_NAMES =
            List.of(
                    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
                    "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý");
    public static final List<String> MIDDLE_NAMES =
            List.of(
                    "Văn", "Thị", "Minh", "Quốc", "Hoàng", "Ngọc", "Thanh", "Gia", "Đức", "Anh",
                    "Hữu", "Bảo", "Khánh", "Tuấn");
    public static final List<String> FIRST_NAMES =
            List.of(
                    "An", "Bình", "Châu", "Dũng", "Giang", "Hải", "Hiếu", "Huy", "Khoa", "Lan",
                    "Linh", "Long", "Mai", "Nam", "Nhi", "Phát", "Phúc", "Quân", "Quyên", "Sơn",
                    "Thảo", "Thịnh", "Trang", "Trung", "Uyên", "Vy", "Yến", "Hạnh", "Tâm", "Kiên");

    public static final List<CandidateRole> CANDIDATE_ROLES =
            List.of(
                    new CandidateRole(
                            "Backend Developer", List.of("Java", "Spring Boot", "MySQL", "Docker")),
                    new CandidateRole(
                            "Frontend Developer", List.of("React", "TypeScript", "Next.js")),
                    new CandidateRole(
                            "Fullstack Developer",
                            List.of("React", "Node.js", "TypeScript", "PostgreSQL")),
                    new CandidateRole(
                            "Mobile Developer", List.of("Flutter", "React Native", "Swift")),
                    new CandidateRole(
                            "DevOps Engineer",
                            List.of("Docker", "Kubernetes", "AWS", "CI/CD", "Linux")),
                    new CandidateRole(
                            "Data Analyst", List.of("SQL", "Power BI", "Tableau", "Python")),
                    new CandidateRole(
                            "Machine Learning Engineer",
                            List.of("Python", "Machine Learning", "TensorFlow")),
                    new CandidateRole("QA Engineer", List.of("Selenium", "Jest", "Agile")),
                    new CandidateRole("UI/UX Designer", List.of("Figma")),
                    new CandidateRole(".NET Developer", List.of(".NET", "C#", "SQL")),
                    new CandidateRole("PHP Developer", List.of("PHP", "Laravel", "MySQL")),
                    new CandidateRole("Go Developer", List.of("Go", "PostgreSQL", "Redis")));

    public static final List<String> EXTRA_SKILLS =
            List.of("Git", "Agile", "English", "Docker", "Linux");
    public static final List<String> SCHOOLS =
            List.of(
                    "Đại học Bách khoa TP.HCM",
                    "Đại học FPT",
                    "Đại học Công nghệ Thông tin - ĐHQG TP.HCM",
                    "Đại học Khoa học Tự nhiên",
                    "Học viện Công nghệ Bưu chính Viễn thông",
                    "Đại học Bách khoa Hà Nội",
                    "Đại học Công nghiệp TP.HCM",
                    "Aptech Computer Education");
    public static final List<String> PAST_COMPANIES =
            List.of(
                    "FPT Software",
                    "VNG",
                    "Tiki",
                    "NashTech",
                    "Grab Vietnam",
                    "Be Group",
                    "Sendo",
                    "TMA Solutions",
                    "Axon",
                    "Got It");
    public static final List<String> LEVELS = List.of("INTERN", "JUNIOR", "MID", "SENIOR");
    public static final List<String> OWNER_LEVELS = List.of("JUNIOR", "SENIOR", "MID", "MID");
    public static final List<String> SKILL_LEVELS =
            List.of("BASIC", "INTERMEDIATE", "PROFICIENT", "EXPERT");
    public static final List<String> SEARCH_STATUSES =
            List.of("ACTIVELY_LOOKING", "ACTIVELY_LOOKING", "OPEN_TO_OFFERS", "NOT_LOOKING");
    public static final List<String> REJECT_REASONS =
            List.of(
                    "Ảnh CCCD bị mờ, không đọc được số",
                    "Ảnh chân dung không khớp với ảnh trên CCCD",
                    "Thông tin họ tên không khớp với CCCD");

    public static final List<JobSpec> JOB_SPECS =
            List.of(
                    new JobSpec(
                            "Senior Java Backend Developer",
                            "SENIOR",
                            List.of("Java", "Spring Boot", "MySQL", "Redis", "Docker")),
                    new JobSpec(
                            "Java Developer",
                            "JUNIOR",
                            List.of("Java", "Spring Boot", "SQL", "Git")),
                    new JobSpec(
                            "Fullstack Developer (React/Node.js)",
                            "MID",
                            List.of("React", "Node.js", "TypeScript", "MongoDB")),
                    new JobSpec(
                            "Frontend Developer (React)",
                            "MID",
                            List.of("React", "TypeScript", "Jest")),
                    new JobSpec(
                            "Next.js Frontend Engineer",
                            "JUNIOR",
                            List.of("Next.js", "React", "TypeScript")),
                    new JobSpec(
                            "Flutter Mobile Developer", "MID", List.of("Flutter", "Git", "Agile")),
                    new JobSpec(
                            "React Native Developer", "MID", List.of("React Native", "TypeScript")),
                    new JobSpec("iOS Developer (Swift)", "SENIOR", List.of("Swift", "Git")),
                    new JobSpec("Android Developer (Kotlin)", "MID", List.of("Kotlin", "Git")),
                    new JobSpec(
                            "DevOps Engineer",
                            "MID",
                            List.of("Docker", "Kubernetes", "AWS", "CI/CD", "Linux")),
                    new JobSpec(
                            "Cloud Engineer (AWS)",
                            "SENIOR",
                            List.of("AWS", "Kubernetes", "Linux")),
                    new JobSpec("Data Engineer", "MID", List.of("Python", "SQL", "Docker")),
                    new JobSpec("Data Analyst", "JUNIOR", List.of("SQL", "Power BI", "Tableau")),
                    new JobSpec(
                            "Machine Learning Engineer",
                            "SENIOR",
                            List.of("Python", "Machine Learning", "TensorFlow")),
                    new JobSpec(
                            "AI Research Intern", "INTERN", List.of("Python", "Machine Learning")),
                    new JobSpec(
                            "QA Automation Engineer", "MID", List.of("Selenium", "Jest", "Agile")),
                    new JobSpec("Manual Tester", "JUNIOR", List.of("Agile", "Scrum", "English")),
                    new JobSpec("UI/UX Designer", "MID", List.of("Figma", "English")),
                    new JobSpec(".NET Backend Developer", "MID", List.of(".NET", "C#", "SQL")),
                    new JobSpec(
                            "PHP Laravel Developer", "JUNIOR", List.of("PHP", "Laravel", "MySQL")),
                    new JobSpec(
                            "Go Backend Engineer",
                            "SENIOR",
                            List.of("Go", "PostgreSQL", "Redis", "Docker")),
                    new JobSpec(
                            "Python Backend Developer",
                            "MID",
                            List.of("Python", "PostgreSQL", "Docker")),
                    new JobSpec(
                            "Tech Lead (Backend)",
                            "LEAD",
                            List.of("Java", "Spring Boot", "AWS", "Agile")),
                    new JobSpec(
                            "Engineering Manager", "LEAD", List.of("Agile", "Scrum", "English")),
                    new JobSpec(
                            "Software Engineer Intern", "INTERN", List.of("Git", "SQL", "English")),
                    new JobSpec(
                            "Part-time Web Developer",
                            "JUNIOR",
                            List.of("React", "Node.js", "Git")),
                    new JobSpec("Security Engineer", "SENIOR", List.of("Linux", "AWS", "Docker")),
                    new JobSpec("Business Analyst", "MID", List.of("SQL", "Agile", "English")));

    public static final List<City> CITIES =
            List.of(
                    new City("TP. Hồ Chí Minh", 10.7769, 106.7009),
                    new City("Hà Nội", 21.0285, 105.8542),
                    new City("Đà Nẵng", 16.0544, 108.2022),
                    new City("Cần Thơ", 10.0452, 105.7469));
    public static final List<String> STREETS =
            List.of(
                    "Nguyễn Huệ",
                    "Lê Lợi",
                    "Trần Hưng Đạo",
                    "Cầu Giấy",
                    "Điện Biên Phủ",
                    "Nguyễn Văn Linh",
                    "Võ Văn Tần",
                    "Láng Hạ",
                    "Hai Bà Trưng",
                    "Phạm Văn Đồng");
    public static final List<String> TITLE_TAGS =
            List.of(
                    "",
                    "",
                    "",
                    " - Fintech",
                    " - E-commerce",
                    " (Remote-friendly)",
                    " - AI Product",
                    " - Platform Team",
                    " - Growth Team");

    public static final Map<String, Integer> JOB_STATUS_WEIGHTS = jobStatusWeights();

    public static final List<List<ScreeningQuestion>> QUESTION_SETS =
            List.of(
                    List.of(
                            new ScreeningQuestion(
                                    "CHOICE",
                                    "Bạn có thể làm việc tại văn phòng không?",
                                    List.of("Có", "Không", "Chỉ hybrid"),
                                    true),
                            new ScreeningQuestion(
                                    "SHORT_TEXT",
                                    "Hãy mô tả ngắn dự án bạn tự hào nhất.",
                                    List.of(),
                                    true)),
                    List.of(
                            new ScreeningQuestion(
                                    "CHOICE",
                                    "Bạn có thể nhận việc trong thời gian nào?",
                                    List.of("Ngay lập tức", "Trong 2 tuần", "Trong 1 tháng"),
                                    true),
                            new ScreeningQuestion(
                                    "SHORT_TEXT",
                                    "Mức lương mong muốn của bạn là bao nhiêu?",
                                    List.of(),
                                    false)));

    public static final String SHORT_TEXT_ANSWER =
            "Tôi làm hệ thống đặt lịch trực tuyến, phục vụ 5.000 người dùng mỗi tháng.";
    public static final String COVER_LETTER =
            "Kính gửi anh/chị, tôi rất quan tâm đến vị trí này và mong có cơ hội trao đổi thêm."
                    + " Trân trọng cảm ơn.";
    public static final List<String> RECRUITER_NOTES =
            List.of(
                    "Hồ sơ phù hợp, cần phỏng vấn kỹ thuật.",
                    "Kinh nghiệm tốt nhưng thiếu kỹ năng giao tiếp tiếng Anh.",
                    "Ứng viên tiềm năng, ưu tiên liên hệ sớm.");

    private DemoSeedData() {}

    public static List<String> fakeNames(SeedRandom random, int count, Set<String> taken) {
        List<String> names = new ArrayList<>();
        Set<String> used = new HashSet<>(taken);
        while (names.size() < count) {
            String name =
                    random.pick(LAST_NAMES)
                            + " "
                            + random.pick(MIDDLE_NAMES)
                            + " "
                            + random.pick(FIRST_NAMES);
            if (used.add(name)) {
                names.add(name);
            }
        }
        return names;
    }

    private static Map<String, Integer> jobStatusWeights() {
        Map<String, Integer> weights = new LinkedHashMap<>();
        weights.put("PUBLISHED", 74);
        weights.put("PAUSED", 7);
        weights.put("CLOSED", 7);
        weights.put("EXPIRED", 4);
        weights.put("DRAFT", 4);
        weights.put("HIDDEN_BY_ADMIN", 4);
        return weights;
    }
}
