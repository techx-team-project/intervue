package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.config.BillingProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.OrderItem;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoicePdfRenderer {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter ISSUED_AT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm", Locale.ENGLISH);

    private static final float MARGIN = 50f;
    private static final float LINE = 15f;
    private static final float PAGE_TOP = PDRectangle.A4.getHeight() - MARGIN;
    private static final float RIGHT = PDRectangle.A4.getWidth() - MARGIN;
    private static final float COLUMN_QTY = MARGIN + 258;
    private static final float COLUMN_UNIT_RIGHT = MARGIN + 385;

    private static final float[] INK_MUTED = {0.42f, 0.45f, 0.50f};
    private static final float[] INK_RULE = {0.85f, 0.87f, 0.89f};
    private static final float[] INK_ACCENT = {0.02f, 0.59f, 0.41f};
    private static final String LOGO_RESOURCE = "branding/intervue-logo.png";
    private static final float LOGO_WIDTH = 110f;

    private final BillingProperties billingProperties;

    public byte[] render(OrderDocumentView view, List<OrderItem> items) {
        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDFont regular = load(document, "fonts/NotoSans-Regular.ttf");
            PDFont bold = load(document, "fonts/NotoSans-Bold.ttf");
            PDImageXObject logo = loadLogo(document);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float y = header(content, bold, regular, view, logo, PAGE_TOP);
                y = parties(content, bold, regular, view, y);
                y = table(content, bold, regular, view, items, y);
                totals(content, bold, regular, view, y);
                footer(content, regular, view);
            }

            document.save(output);
            return output.toByteArray();
        } catch (IOException cause) {
            log.warn("Could not render document for order {}", view.orderCode(), cause);
            throw new AppException(ErrorCode.INVOICE_RENDER_FAILED);
        }
    }

    // Logo top-left, title block top-right — a real invoice number or a long status line never
    // collides with the logo, no matter how wide either one is
    private float header(
            PDPageContentStream content,
            PDFont bold,
            PDFont regular,
            OrderDocumentView view,
            PDImageXObject logo,
            float y)
            throws IOException {
        float logoHeight = LOGO_WIDTH * logo.getHeight() / logo.getWidth();
        content.drawImage(logo, MARGIN, y - logoHeight - 4, LOGO_WIDTH, logoHeight);

        float metaY = y - 4;
        colour(content, INK_ACCENT);
        writeRight(content, bold, 20, RIGHT, metaY, view.documentTitle());
        colour(content, null);
        metaY -= LINE * 1.7f;

        if (view.statusLabel() != null) {
            colour(content, view.statusColor());
            writeRight(content, bold, 10, RIGHT, metaY, view.statusLabel());
            colour(content, null);
            metaY -= LINE * 1.2f;
        }
        if (view.documentNumber() != null && !view.documentNumber().isBlank()) {
            writeRight(content, bold, 11, RIGHT, metaY, view.documentNumber());
            metaY -= LINE;
        }
        muted(content, regular, 9, RIGHT, metaY, "Order " + view.orderCode(), true);
        metaY -= LINE;
        muted(
                content,
                regular,
                9,
                RIGHT,
                metaY,
                "Issued " + ISSUED_AT.format(view.issuedAt().atZone(VIETNAM)),
                true);

        float bottom = Math.min(y - logoHeight - LINE * 0.6f, metaY - LINE * 0.6f);
        rule(content, bottom);
        return bottom - LINE * 1.6f;
    }

    private float parties(
            PDPageContentStream content,
            PDFont bold,
            PDFont regular,
            OrderDocumentView view,
            float y)
            throws IOException {
        BillingProperties.Seller seller = billingProperties.seller();
        List<String> from = new ArrayList<>();
        add(from, seller.name());
        add(from, labelled("Tax code: ", seller.taxCode()));
        add(from, seller.address());
        add(from, seller.email());
        add(from, seller.phone());

        List<String> to = new ArrayList<>();
        add(to, view.buyerName());
        add(to, labelled("Tax code: ", view.buyerTaxId()));
        add(to, view.buyerAddress());
        add(to, view.recipientEmail());

        float columnTwo = MARGIN + 270;
        muted(content, bold, 9, MARGIN, y, "FROM", false);
        muted(content, bold, 9, columnTwo, y, "BILL TO", false);
        y -= LINE * 1.2f;

        float left = y;
        for (String row : wrapAll(regular, from, columnTwo - MARGIN - 24)) {
            write(content, regular, 10, MARGIN, left, row);
            left -= LINE;
        }
        float right = y;
        for (String row : wrapAll(regular, to, RIGHT - columnTwo)) {
            write(content, regular, 10, columnTwo, right, row);
            right -= LINE;
        }

        return Math.min(left, right) - LINE * 1.2f;
    }

    private float table(
            PDPageContentStream content,
            PDFont bold,
            PDFont regular,
            OrderDocumentView view,
            List<OrderItem> items,
            float y)
            throws IOException {
        muted(content, bold, 9, MARGIN, y, "DESCRIPTION", false);
        muted(content, bold, 9, COLUMN_QTY, y, "QTY", false);
        writeRight(content, bold, 9, COLUMN_UNIT_RIGHT, y, "UNIT PRICE");
        writeRight(content, bold, 9, RIGHT, y, "AMOUNT");
        colour(content, null);
        y -= LINE * 0.5f;
        rule(content, y);
        y -= LINE * 1.2f;

        int index = 1;
        for (OrderItem item : items) {
            write(
                    content,
                    regular,
                    10,
                    MARGIN,
                    y,
                    index++ + ". " + truncate(item.getPackageName(), 38));
            write(content, regular, 10, COLUMN_QTY, y, String.valueOf(item.getQuantity()));
            writeRight(
                    content,
                    regular,
                    10,
                    COLUMN_UNIT_RIGHT,
                    y,
                    money(item.getUnitPrice(), view.currency()));
            writeRight(content, regular, 10, RIGHT, y, money(item.getLineTotal(), view.currency()));
            y -= LINE * 1.3f;
        }

        y += LINE * 0.3f;
        rule(content, y);
        return y - LINE * 1.4f;
    }

    private void totals(
            PDPageContentStream content,
            PDFont bold,
            PDFont regular,
            OrderDocumentView view,
            float y)
            throws IOException {
        float labelX = MARGIN + 300;
        String currency = view.currency();

        muted(content, regular, 10, labelX, y, "Subtotal", false);
        writeRight(content, regular, 10, RIGHT, y, money(view.subtotal(), currency));
        y -= LINE * 1.2f;

        if (view.discountAmount() > 0) {
            muted(content, regular, 10, labelX, y, "Discount", false);
            writeRight(
                    content, regular, 10, RIGHT, y, "-" + money(view.discountAmount(), currency));
            y -= LINE * 1.2f;
        }

        int vatPercent = view.vatRate().multiply(BigDecimal.valueOf(100)).intValue();
        muted(content, regular, 10, labelX, y, "VAT " + vatPercent + "%", false);
        writeRight(content, regular, 10, RIGHT, y, money(view.vatAmount(), currency));
        y -= LINE * 1.1f;

        rule(content, y, labelX);
        y -= LINE * 1.3f;

        write(content, bold, 12, labelX, y, view.totalsLabel());
        colour(content, INK_ACCENT);
        writeRight(content, bold, 12, RIGHT, y, money(view.totalAmount(), currency));
        colour(content, null);
    }

    private void footer(PDPageContentStream content, PDFont regular, OrderDocumentView view)
            throws IOException {
        rule(content, MARGIN + LINE * 2.2f);
        muted(content, regular, 8.5f, MARGIN, MARGIN + LINE, view.notice(), false);
    }

    private PDFont load(PDDocument document, String path) throws IOException {
        try (InputStream stream = new ClassPathResource(path).getInputStream()) {
            return PDType0Font.load(document, stream);
        }
    }

    private PDImageXObject loadLogo(PDDocument document) throws IOException {
        try (InputStream stream = new ClassPathResource(LOGO_RESOURCE).getInputStream()) {
            return PDImageXObject.createFromByteArray(
                    document, stream.readAllBytes(), "intervue-logo");
        }
    }

    // A buyer address is free text and routinely wider than its column
    private List<String> wrapAll(PDFont font, List<String> rows, float maxWidth)
            throws IOException {
        List<String> wrapped = new ArrayList<>();
        for (String row : rows) {
            wrapped.addAll(wrap(font, row, maxWidth));
        }
        return wrapped;
    }

    private List<String> wrap(PDFont font, String text, float maxWidth) throws IOException {
        List<String> lines = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (String word : text.split(" ")) {
            String candidate = current.isEmpty() ? word : current + " " + word;
            if (width(font, candidate) <= maxWidth || current.isEmpty()) {
                current.setLength(0);
                current.append(candidate);
            } else {
                lines.add(current.toString());
                current.setLength(0);
                current.append(word);
            }
        }
        if (!current.isEmpty()) {
            lines.add(current.toString());
        }
        return lines;
    }

    private float width(PDFont font, String text) throws IOException {
        return font.getStringWidth(text) / 1000 * 10;
    }

    private String labelled(String label, String value) {
        return value == null || value.isBlank() ? null : label + value;
    }

    private void add(List<String> rows, String value) {
        if (value != null && !value.isBlank()) {
            rows.add(value);
        }
    }

    private void colour(PDPageContentStream content, float[] rgb) throws IOException {
        if (rgb == null) {
            content.setNonStrokingColor(0f, 0f, 0f);
            return;
        }
        content.setNonStrokingColor(rgb[0], rgb[1], rgb[2]);
    }

    private void muted(
            PDPageContentStream content,
            PDFont font,
            float size,
            float x,
            float y,
            String text,
            boolean alignRight)
            throws IOException {
        colour(content, INK_MUTED);
        if (alignRight) {
            writeRight(content, font, size, x, y, text);
        } else {
            write(content, font, size, x, y, text);
        }
        colour(content, null);
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
        rule(content, y, MARGIN);
    }

    private void rule(PDPageContentStream content, float y, float fromX) throws IOException {
        content.setStrokingColor(INK_RULE[0], INK_RULE[1], INK_RULE[2]);
        content.setLineWidth(0.7f);
        content.moveTo(fromX, y);
        content.lineTo(RIGHT, y);
        content.stroke();
    }

    private String money(long amount, String currency) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.ENGLISH);
        symbols.setGroupingSeparator(',');
        return new DecimalFormat("#,##0", symbols).format(amount) + " " + currency;
    }

    private String truncate(String value, int max) {
        if (value == null) {
            return "";
        }
        return value.length() <= max ? value : value.substring(0, max - 1) + "…";
    }
}
