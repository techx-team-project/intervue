package com.techx.intervue.modules.billing.enums;

import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;

/** Bank codes accepted by qr.sepay.vn; a code outside this list renders an HTML page, not a QR. */
@Getter
public enum SupportedBank {
    ABBANK("ABBANK", "Ngân hàng An Bình"),
    ACB("ACB", "Ngân hàng Á Châu"),
    AGRIBANK("Agribank", "Ngân hàng Nông nghiệp và Phát triển Nông thôn"),
    BIDV("BIDV", "Ngân hàng Đầu tư và Phát triển Việt Nam"),
    BAOVIETBANK("BaoVietBank", "Ngân hàng Bảo Việt"),
    CAKE("CAKE", "CAKE by VPBank"),
    DONGABANK("DongABank", "Ngân hàng Đông Á"),
    EXIMBANK("Eximbank", "Ngân hàng Xuất Nhập khẩu Việt Nam"),
    GPBANK("GPBank", "Ngân hàng Dầu khí Toàn cầu"),
    HDBANK("HDBank", "Ngân hàng Phát triển TP.HCM"),
    KIENLONGBANK("KienLongBank", "Ngân hàng Kiên Long"),
    LPBANK("LPBank", "Ngân hàng Lộc Phát Việt Nam"),
    MBBANK("MBBank", "Ngân hàng Quân đội"),
    MSB("MSB", "Ngân hàng Hàng hải Việt Nam"),
    NAMABANK("NamABank", "Ngân hàng Nam Á"),
    NCB("NCB", "Ngân hàng Quốc dân"),
    OCB("OCB", "Ngân hàng Phương Đông"),
    OCEANBANK("Oceanbank", "Ngân hàng Đại Dương"),
    PGBANK("PGBank", "Ngân hàng Thịnh vượng và Phát triển"),
    PVCOMBANK("PVcomBank", "Ngân hàng Đại Chúng Việt Nam"),
    SACOMBANK("Sacombank", "Ngân hàng Sài Gòn Thương Tín"),
    SAIGONBANK("SaigonBank", "Ngân hàng Sài Gòn Công Thương"),
    SCB("SCB", "Ngân hàng Sài Gòn"),
    SEABANK("SeABank", "Ngân hàng Đông Nam Á"),
    SHB("SHB", "Ngân hàng Sài Gòn - Hà Nội"),
    TECHCOMBANK("Techcombank", "Ngân hàng Kỹ thương Việt Nam"),
    TIMO("Timo", "Timo by Ban Viet Bank"),
    TPBANK("TPBank", "Ngân hàng Tiên Phong"),
    UBANK("Ubank", "Ubank by VPBank"),
    VIB("VIB", "Ngân hàng Quốc tế Việt Nam"),
    VIETABANK("VietABank", "Ngân hàng Việt Á"),
    VIETBANK("VietBank", "Ngân hàng Việt Nam Thương Tín"),
    VIETCAPITALBANK("VietCapitalBank", "Ngân hàng Bản Việt"),
    VIETCOMBANK("Vietcombank", "Ngân hàng Ngoại thương Việt Nam"),
    VIETINBANK("VietinBank", "Ngân hàng Công thương Việt Nam", "SEVQR"),
    VPBANK("VPBank", "Ngân hàng Việt Nam Thịnh Vượng"),
    VRB("VRB", "Ngân hàng Liên doanh Việt - Nga"),
    WOORIBANK("Woori", "Ngân hàng Woori Việt Nam");

    private final String code;
    private final String name;

    /** VietinBank only notifies SePay when the transfer content starts with this keyword. */
    private final String contentKeyword;

    SupportedBank(String code, String name) {
        this(code, name, null);
    }

    SupportedBank(String code, String name, String contentKeyword) {
        this.code = code;
        this.name = name;
        this.contentKeyword = contentKeyword;
    }

    public static Optional<SupportedBank> byCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        String normalized = code.trim();
        return Arrays.stream(values())
                .filter(bank -> bank.code.equalsIgnoreCase(normalized))
                .findFirst();
    }

    public static boolean isSupported(String code) {
        return byCode(code).isPresent();
    }

    public static String transferContent(String bankCode, String orderCode) {
        String keyword =
                bankCode == null
                        ? null
                        : byCode(bankCode).map(SupportedBank::getContentKeyword).orElse(null);
        return keyword == null ? orderCode : keyword + " " + orderCode;
    }
}
