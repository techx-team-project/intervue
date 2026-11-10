package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.Invoice;
import com.techx.intervue.modules.billing.entities.OrderItem;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class InvoicePdfRenderer {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter ISSUED_AT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final String NOTICE =
            "Chứng từ nội bộ — không phải hoá đơn điện tử có mã của cơ quan thuế.";

    private static final float MARGIN = 48f;
    private static final float LINE = 16f;
    private static final float PAGE_TOP = PDRectangle.A4.getHeight() - MARGIN;
    private static final float RIGHT_EDGE = PDRectangle.A4.getWidth() - MARGIN;

    public byte[] render(Invoice invoice, List<OrderItem> items, String orderCode) {
        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDFont regular = load(document, "fonts/NotoSans-Regular.ttf");
            PDFont bold = load(document, "fonts/NotoSans-Bold.ttf");

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float y = PAGE_TOP;
                y = header(content, bold, regular, invoice, orderCode, y);
                y = buyer(content, bold, regular, invoice, y);
                y = table(content, bold, regular, items, y);
                totals(content, bold, regular, invoice, y);
                footer(content, regular);
            }

            document.save(output);
            return output.toByteArray();
        } catch (IOException cause) {
            log.warn("Could not render invoice {}", invoice.getNumber(), cause);
            throw new AppException(ErrorCode.INVOICE_RENDER_FAILED);
        }
    }

    private float header(
            PDPageContentStream content,
            PDFont bold,
            PDFont regular,
            Invoice invoice,
            String orderCode,
            float y)
            throws IOException {
        write(content, bold, 18, MARGIN, y, "HOÁ ĐƠN DỊCH VỤ");
        y -= LINE * 1.6f;
        write(content, regular, 10, MARGIN, y, "InterVue — Nền tảng tuyển dụng IT");
        y -= LINE;
        write(content, regular, 10, MARGIN, y, "Số: " + invoice.getNumber());
        write(content, regular, 10, MARGIN + 220, y, "Mã đơn: " + orderCode);
        y -= LINE;
        write(
                content,
                regular,
                10,
                MARGIN,
                y,
                "Ngày phát hành: " + ISSUED_AT.format(invoice.getIssuedAt().atZone(VIETNAM)));
        return y - LINE * 1.8f;
    }

    private float buyer(
            PDPageContentStream content, PDFont bold, PDFont regular, Invoice invoice, float y)
            throws IOException {
        write(content, bold, 11, MARGIN, y, "Bên mua");
        y -= LINE;
        write(content, regular, 10, MARGIN, y, invoice.getBuyerName());
        if (invoice.getBuyerTaxId() != null) {
            y -= LINE;
            write(content, regular, 10, MARGIN, y, "Mã số thuế: " + invoice.getBuyerTaxId());
        }
        if (invoice.getBuyerAddress() != null) {
            y -= LINE;
            write(content, regular, 10, MARGIN, y, "Địa chỉ: " + invoice.getBuyerAddress());
        }
        y -= LINE;
        write(content, regular, 10, MARGIN, y, "Email nhận: " + invoice.getRecipientEmail());
        return y - LINE * 1.8f;
    }

    private float table(
            PDPageContentStream content,
            PDFont bold,
            PDFont regular,
            List<OrderItem> items,
            float y)
            throws IOException {
        write(content, bold, 10, MARGIN, y, "Dịch vụ");
        write(content, bold, 10, MARGIN + 300, y, "SL");
        writeRight(content, bold, 10, RIGHT_EDGE, y, "Thành tiền");
        y -= LINE * 0.4f;
        rule(content, y);
        y -= LINE;

        for (OrderItem item : items) {
            long lineTotal = item.getUnitPrice() * item.getQuantity();
            write(content, regular, 10, MARGIN, y, truncate(item.getPackageName(), 48));
            write(content, regular, 10, MARGIN + 300, y, String.valueOf(item.getQuantity()));
            writeRight(content, regular, 10, RIGHT_EDGE, y, money(lineTotal));
            y -= LINE;
        }

        y -= LINE * 0.2f;
        rule(content, y);
        return y - LINE * 1.2f;
    }

    private void totals(
            PDPageContentStream content, PDFont bold, PDFont regular, Invoice invoice, float y)
            throws IOException {
        float labelX = MARGIN + 300;
        write(content, regular, 10, labelX, y, "Tạm tính");
        writeRight(content, regular, 10, RIGHT_EDGE, y, money(invoice.getSubtotal()));
        y -= LINE;

        if (invoice.getDiscountAmount() > 0) {
            write(content, regular, 10, labelX, y, "Chiết khấu");
            writeRight(
                    content, regular, 10, RIGHT_EDGE, y, "-" + money(invoice.getDiscountAmount()));
            y -= LINE;
        }

        int vatPercent =
                invoice.getVatRate().multiply(java.math.BigDecimal.valueOf(100)).intValue();
        write(content, regular, 10, labelX, y, "VAT " + vatPercent + "%");
        writeRight(content, regular, 10, RIGHT_EDGE, y, money(invoice.getVatAmount()));
        y -= LINE * 1.2f;

        write(content, bold, 12, labelX, y, "Tổng cộng");
        writeRight(content, bold, 12, RIGHT_EDGE, y, money(invoice.getTotalAmount()));
    }

    private void footer(PDPageContentStream content, PDFont regular) throws IOException {
        write(content, regular, 9, MARGIN, MARGIN + LINE, NOTICE);
    }

    private PDFont load(PDDocument document, String path) throws IOException {
        try (InputStream stream = new ClassPathResource(path).getInputStream()) {
            return PDType0Font.load(document, stream);
        }
    }

    private void write(
            PDPageContentStream content, PDFont font, float size, float x, float y, String text)
            throws IOException {
        content.beginText();
        content.setFont(font, size);
        content.newLineAtOffset(x, y);
        content.showText(text == null ? "" : text);
        content.endText();
    }

    private void writeRight(
            PDPageContentStream content, PDFont font, float size, float x, float y, String text)
            throws IOException {
        float width = font.getStringWidth(text) / 1000 * size;
        write(content, font, size, x - width, y, text);
    }

    private void rule(PDPageContentStream content, float y) throws IOException {
        content.moveTo(MARGIN, y);
        content.lineTo(RIGHT_EDGE, y);
        content.stroke();
    }

    private String money(long amount) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.of("vi", "VN"));
        symbols.setGroupingSeparator('.');
        return new DecimalFormat("#,##0", symbols).format(amount) + " đ";
    }

    private String truncate(String value, int max) {
        if (value == null) {
            return "";
        }
        return value.length() <= max ? value : value.substring(0, max - 1) + "…";
    }
}
