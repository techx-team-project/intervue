package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CompanySearchService implements CompanySearchServiceInterface {

    private static final List<CompanySearchResult> CATALOG =
            List.of(
                    new CompanySearchResult(
                            "1",
                            "Tập Đoàn Công Nghiệp - Viễn Thông Quân Đội (Viettel)",
                            "Viễn thông & Công nghệ",
                            "10.000+ nhân viên",
                            "Số 1 Trần Hữu Dực, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội",
                            "https://viettel.com.vn",
                            true,
                            45,
                            List.of(
                                    "Thương hiệu quốc gia uy tín",
                                    "Thưởng hiệu quả kinh doanh lên tới 6 tháng lương",
                                    "Bảo hiểm sức khỏe cao cấp cho gia đình",
                                    "Cơ hội luân chuyển làm việc tại 10 thị trường quốc tế"),
                            "/companies/1"),
                    new CompanySearchResult(
                            "3",
                            "Công ty Cổ phần FPT Software",
                            "IT - Phần mềm & Xuất khẩu phần mềm",
                            "30.000+ nhân viên",
                            "Tòa nhà FPT Cầu Giấy, Phố Duy Tân, Quận Cầu Giấy, Hà Nội",
                            "https://fptsoftware.com",
                            true,
                            62,
                            List.of(
                                    "Công ty công nghệ phần mềm số 1 Việt Nam",
                                    "Chế độ làm việc linh hoạt Hybrid",
                                    "Chương trình đào tạo chứng chỉ quốc tế tài trợ 100%",
                                    "Cơ hội Onsite Nhật Bản, Mỹ, Châu Âu"),
                            "/companies/3"),
                    new CompanySearchResult(
                            "5",
                            "Công ty Cổ phần VNG (VNG Corporation)",
                            "IT - Phần mềm & Game",
                            "4.000+ nhân viên",
                            "VNG Campus, Đường số 13, Khu chế xuất Tân Thuận, Quận 7, TP. HCM",
                            "https://vng.com.vn",
                            true,
                            24,
                            List.of(
                                    "Kỳ lân công nghệ đầu tiên tại Việt Nam",
                                    "Văn phòng hiện đại chuẩn Silicon Valley",
                                    "Bữa sáng và bữa trưa miễn phí tại Campus",
                                    "Thưởng hiệu quả và ESOP"),
                            "/companies/5"),
                    new CompanySearchResult(
                            "4",
                            "Ngân Hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
                            "Ngân hàng & Fintech số",
                            "12.000+ nhân viên",
                            "Số 6 Quang Trung, Phường Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội",
                            "https://techcombank.com",
                            true,
                            29,
                            List.of(
                                    "Ngân hàng chuyển đổi số hàng đầu",
                                    "Thu nhập cạnh tranh theo năng lực",
                                    "Môi trường Agile hiện đại",
                                    "Gói chăm sóc sức khỏe Techcom Care"),
                            "/companies/4"),
                    new CompanySearchResult(
                            "2",
                            "Ngân Hàng TMCP Quân Đội (MB Bank)",
                            "Ngân hàng & Tài chính",
                            "15.000+ nhân viên",
                            "Tòa nhà MB Grand Tower, 63 Lê Văn Lương, Cầu Giấy, Hà Nội",
                            "https://mbbank.com.vn",
                            true,
                            38,
                            List.of(
                                    "Top 5 ngân hàng thương mại uy tín",
                                    "Phúc lợi toàn diện và thưởng lễ tết hấp dẫn",
                                    "Lộ trình thăng tiến rõ ràng",
                                    "Văn hóa kỷ luật và đoàn kết"),
                            "/companies/2"),
                    new CompanySearchResult(
                            "6",
                            "Shopee Việt Nam (Sea Group)",
                            "Bán lẻ & Thương mại điện tử",
                            "5.000+ nhân viên",
                            "Tòa nhà Saigon Centre, 67 Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM",
                            "https://shopee.vn",
                            true,
                            51,
                            List.of(
                                    "Nền tảng thương mại điện tử hàng đầu Đông Nam Á",
                                    "Môi trường quốc tế năng động",
                                    "Trợ cấp thiết bị làm việc",
                                    "Bảo hiểm sức khỏe cao cấp"),
                            "/companies/6"),
                    new CompanySearchResult(
                            "8",
                            "Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
                            "Ngân hàng & Tài chính",
                            "25.000+ nhân viên",
                            "89 Láng Hạ, Quận Đống Đa, Hà Nội",
                            "https://vpbank.com.vn",
                            true,
                            41,
                            List.of(
                                    "Ngân hàng tư nhân top đầu thị trường",
                                    "Chính sách đãi ngộ nhân tài nổi bật",
                                    "Hệ thống công nghệ ngân hàng số tiên tiến"),
                            "/companies/8"),
                    new CompanySearchResult(
                            "237340",
                            "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ TỰ ĐỘNG HÓA ADI",
                            "Tự động hóa & Thiết bị công nghiệp",
                            "25 - 99 nhân viên",
                            "Số nhà 20B7 Đầm Trấu, Phường Bạch Đằng, Quận Hai Bà Trưng, Hà Nội",
                            "https://adivietnam.com",
                            true,
                            3,
                            List.of(
                                    "Đơn vị tiên phong về giải pháp tự động hóa",
                                    "Môi trường kỹ thuật thân thiện",
                                    "Đào tạo chuyên sâu về PLC và SCADA"),
                            "/companies/237340"));

    @Override
    public List<CompanySearchResult> search(
            String keyword, String industry, String location, int limit) {
        if (keyword == null || keyword.isBlank()) {
            return CATALOG.stream().limit(Math.max(1, limit)).toList();
        }

        String normalizedKeyword = normalize(keyword);
        String normalizedIndustry = industry != null ? normalize(industry) : null;
        String normalizedLocation = location != null ? normalize(location) : null;

        List<CompanySearchResult> matches = new ArrayList<>();

        for (CompanySearchResult company : CATALOG) {
            boolean nameOrFieldMatch = matchesAny(company, normalizedKeyword);
            if (!nameOrFieldMatch) {
                continue;
            }

            if (normalizedIndustry != null && !normalizedIndustry.isBlank()) {
                String compInd = normalize(company.industry());
                if (!compInd.contains(normalizedIndustry)
                        && !normalizedIndustry.contains(compInd)) {
                    continue;
                }
            }

            if (normalizedLocation != null && !normalizedLocation.isBlank()) {
                String compLoc = normalize(company.address());
                if (!compLoc.contains(normalizedLocation)
                        && !normalizedLocation.contains(compLoc)) {
                    continue;
                }
            }

            matches.add(company);
            if (matches.size() >= limit) {
                break;
            }
        }

        if (matches.isEmpty() && (normalizedIndustry != null || normalizedLocation != null)) {
            for (CompanySearchResult company : CATALOG) {
                if (matchesAny(company, normalizedKeyword)) {
                    matches.add(company);
                    if (matches.size() >= limit) {
                        break;
                    }
                }
            }
        }

        return matches;
    }

    private boolean matchesAny(CompanySearchResult company, String normalizedKeyword) {
        if (normalize(company.name()).contains(normalizedKeyword)) {
            return true;
        }
        if (normalize(company.industry()).contains(normalizedKeyword)) {
            return true;
        }
        for (String highlight : company.highlights()) {
            if (normalize(highlight).contains(normalizedKeyword)) {
                return true;
            }
        }
        return normalize(company.address()).contains(normalizedKeyword);
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
