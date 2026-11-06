package com.techx.intervue.modules.candidate.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.impl.CvTextExtractorService;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Duration;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class CvTextExtractorServiceTest {

    @Mock private StringRedisTemplate redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;

    private ObjectMapper objectMapper;
    private CvTextCleaner cvTextCleaner;
    private CvTextExtractorService service;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        cvTextCleaner = new CvTextCleaner();
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        service = new CvTextExtractorService(redisTemplate, objectMapper, cvTextCleaner);
    }

    @Test
    @DisplayName("Returns EMPTY_FILE when input is null, empty or blank stream")
    void handlesEmptyInput() {
        CvTextExtractionResult nullResult = service.extractText((byte[]) null);
        assertThat(nullResult.readable()).isFalse();
        assertThat(nullResult.unreadableReason()).isEqualTo(CvUnreadableReason.EMPTY_FILE);

        CvTextExtractionResult emptyResult = service.extractText(new byte[0]);
        assertThat(emptyResult.readable()).isFalse();
        assertThat(emptyResult.unreadableReason()).isEqualTo(CvUnreadableReason.EMPTY_FILE);

        CvTextExtractionResult streamResult =
                service.extractText(new ByteArrayInputStream(new byte[0]));
        assertThat(streamResult.readable()).isFalse();
        assertThat(streamResult.unreadableReason()).isEqualTo(CvUnreadableReason.EMPTY_FILE);

        CvTextExtractionResult multipartResult =
                service.extractText(
                        new MockMultipartFile("file", "empty.pdf", "application/pdf", new byte[0]));
        assertThat(multipartResult.readable()).isFalse();
        assertThat(multipartResult.unreadableReason()).isEqualTo(CvUnreadableReason.EMPTY_FILE);
    }

    @Test
    @DisplayName("Returns CORRUPTED_PDF when byte array does not have PDF magic header")
    void handlesCorruptedHeader() {
        byte[] fakePdf = "Not a PDF document at all".getBytes();
        CvTextExtractionResult result = service.extractText(fakePdf);

        assertThat(result.readable()).isFalse();
        assertThat(result.unreadableReason()).isEqualTo(CvUnreadableReason.CORRUPTED_PDF);
    }

    @Test
    @DisplayName("Returns FILE_SIZE_EXCEEDED when file exceeds 5MB")
    void handlesFileSizeExceeded() {
        byte[] bigFile = new byte[(int) CvTextExtractorService.MAX_FILE_SIZE_BYTES + 10];
        bigFile[0] = 0x25;
        bigFile[1] = 0x50;
        bigFile[2] = 0x44;
        bigFile[3] = 0x46;

        CvTextExtractionResult result = service.extractText(bigFile);

        assertThat(result.readable()).isFalse();
        assertThat(result.unreadableReason()).isEqualTo(CvUnreadableReason.FILE_SIZE_EXCEEDED);
    }

    @Test
    @DisplayName("Extracts and cleans readable text from valid PDF")
    void extractsReadableTextSuccessfully() throws IOException {
        String content =
                "Nguyen Van A - Senior Software Engineer with deep expertise in Java and Spring Boot.";
        byte[] pdfBytes = createPdfWithText(content, 1);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);

        CvTextExtractionResult result = service.extractText(pdfBytes);

        assertThat(result.readable()).isTrue();
        assertThat(result.text()).contains("Nguyen Van A");
        assertThat(result.pageCount()).isEqualTo(1);
        assertThat(result.fileHash()).isNotEmpty();
        assertThat(result.fromCache()).isFalse();

        verify(valueOperations)
                .set(
                        eq("cv:text:cache:" + result.fileHash()),
                        anyString(),
                        eq(Duration.ofDays(30)));
    }

    @Test
    @DisplayName("Returns cached result when present in Redis")
    void returnsCachedResult() throws Exception {
        String content =
                "Cached CV Content with sufficient characters to pass scanned check easily.";
        byte[] pdfBytes = createPdfWithText(content, 1);
        String hash = service.calculateHash(pdfBytes);

        CvTextExtractionResult cachedResult =
                CvTextExtractionResult.readable(hash, content, 1, false);
        String cachedJson = objectMapper.writeValueAsString(cachedResult);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("cv:text:cache:" + hash)).thenReturn(cachedJson);

        CvTextExtractionResult result = service.extractText(pdfBytes);

        assertThat(result.readable()).isTrue();
        assertThat(result.text()).isEqualTo(content);
        assertThat(result.fromCache()).isTrue();
        verify(valueOperations, never()).set(anyString(), anyString(), any(Duration.class));
    }

    @Test
    @DisplayName("Returns PAGE_LIMIT_EXCEEDED when PDF has more than 5 pages")
    void detectsPageLimitExceeded() throws IOException {
        byte[] pdfBytes = createMultiPagePdf(6);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);

        CvTextExtractionResult result = service.extractText(pdfBytes);

        assertThat(result.readable()).isFalse();
        assertThat(result.unreadableReason()).isEqualTo(CvUnreadableReason.PAGE_LIMIT_EXCEEDED);
        assertThat(result.pageCount()).isEqualTo(6);
    }

    @Test
    @DisplayName("Returns PASSWORD_PROTECTED when PDF is encrypted")
    void detectsPasswordProtectedPdf() throws IOException {
        byte[] pdfBytes = createEncryptedPdf("secretPassword");

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);

        CvTextExtractionResult result = service.extractText(pdfBytes);

        assertThat(result.readable()).isFalse();
        assertThat(result.unreadableReason()).isEqualTo(CvUnreadableReason.PASSWORD_PROTECTED);
    }

    @Test
    @DisplayName("Returns SCANNED_PDF when PDF has blank pages or very low character count")
    void detectsScannedPdf() throws IOException {
        byte[] pdfBytes = createMultiPagePdf(1);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);

        CvTextExtractionResult result = service.extractText(pdfBytes);

        assertThat(result.readable()).isFalse();
        assertThat(result.unreadableReason()).isEqualTo(CvUnreadableReason.SCANNED_PDF);
    }

    @Test
    @DisplayName("Evicts cache entry by file hash")
    void evictsCacheSuccessfully() {
        service.evictCache("abc123hash");
        verify(redisTemplate).delete("cv:text:cache:abc123hash");
    }

    private byte[] createPdfWithText(String text, int pages) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            for (int i = 0; i < pages; i++) {
                PDPage page = new PDPage();
                doc.addPage(page);
                if (i == 0 && text != null) {
                    try (PDPageContentStream stream = new PDPageContentStream(doc, page)) {
                        stream.beginText();
                        stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                        stream.newLineAtOffset(50, 700);
                        stream.showText(text);
                        stream.endText();
                    }
                }
            }
            doc.save(out);
        }
        return out.toByteArray();
    }

    private byte[] createMultiPagePdf(int pages) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            for (int i = 0; i < pages; i++) {
                doc.addPage(new PDPage());
            }
            doc.save(out);
        }
        return out.toByteArray();
    }

    private byte[] createEncryptedPdf(String password) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);
            try (PDPageContentStream stream = new PDPageContentStream(doc, page)) {
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                stream.newLineAtOffset(50, 700);
                stream.showText("Confidential content that requires password to decrypt.");
                stream.endText();
            }
            AccessPermission ap = new AccessPermission();
            StandardProtectionPolicy policy = new StandardProtectionPolicy(password, password, ap);
            doc.protect(policy);
            doc.save(out);
        }
        return out.toByteArray();
    }
}
