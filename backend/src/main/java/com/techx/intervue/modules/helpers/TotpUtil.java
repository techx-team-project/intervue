package com.techx.intervue.modules.helpers;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public final class TotpUtil {

    private static final String HMAC_ALGORITHM = "HmacSHA1";
    private static final int TIME_STEP_SECONDS = 30;
    private static final int CODE_DIGITS = 6;
    private static final int MODULO = 1_000_000;
    private static final int SECRET_BYTE_LENGTH = 20;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    // RFC 4648 Base32 alphabet
    private static final String BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    private static final int[] BASE32_LOOKUP = new int[128];

    static {
        for (int i = 0; i < BASE32_LOOKUP.length; i++) {
            BASE32_LOOKUP[i] = -1;
        }
        for (int i = 0; i < BASE32_CHARS.length(); i++) {
            BASE32_LOOKUP[BASE32_CHARS.charAt(i)] = i;
        }
    }

    private TotpUtil() {}

    public static String generateSecretKey() {
        byte[] bytes = new byte[SECRET_BYTE_LENGTH];
        SECURE_RANDOM.nextBytes(bytes);
        return encodeBase32(bytes);
    }

    public static String getTotpUri(String secret, String accountName, String issuer) {
        String cleanIssuer = issuer.replace(":", "").trim();
        String cleanAccount = accountName.trim();
        return String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=%d&period=%d",
                cleanIssuer, cleanAccount, secret, cleanIssuer, CODE_DIGITS, TIME_STEP_SECONDS);
    }

    public static String generateQrCodeDataUrl(String otpauthUri, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
            hints.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8.name());
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix =
                    qrCodeWriter.encode(otpauthUri, BarcodeFormat.QR_CODE, width, height, hints);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] pngBytes = outputStream.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngBytes);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate QR code", e);
        }
    }

    public static boolean validateCode(String secretBase32, String codeStr) {
        if (secretBase32 == null || codeStr == null) {
            return false;
        }
        String cleanCode = codeStr.replaceAll("\\s+", "");
        if (cleanCode.length() != CODE_DIGITS || !cleanCode.matches("\\d+")) {
            return false;
        }

        try {
            byte[] keyBytes = decodeBase32(secretBase32);
            long currentWindow = Instant.now().getEpochSecond() / TIME_STEP_SECONDS;

            // Check current step, -1 step, +1 step (window tolerance)
            for (int i = -1; i <= 1; i++) {
                String expected = generateCodeForWindow(keyBytes, currentWindow + i);
                if (MessageDigest.isEqual(
                        expected.getBytes(StandardCharsets.UTF_8),
                        cleanCode.getBytes(StandardCharsets.UTF_8))) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public static List<String> generateBackupCodes(int count) {
        List<String> codes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            int part1 = SECURE_RANDOM.nextInt(9000) + 1000;
            int part2 = SECURE_RANDOM.nextInt(9000) + 1000;
            codes.add(String.format("%04d-%04d", part1, part2));
        }
        return codes;
    }

    private static String generateCodeForWindow(byte[] keyBytes, long window) throws Exception {
        byte[] data = ByteBuffer.allocate(8).putLong(window).array();
        Mac mac = Mac.getInstance(HMAC_ALGORITHM);
        mac.init(new SecretKeySpec(keyBytes, HMAC_ALGORITHM));
        byte[] hash = mac.doFinal(data);

        int offset = hash[hash.length - 1] & 0x0f;
        int binary =
                ((hash[offset] & 0x7f) << 24)
                        | ((hash[offset + 1] & 0xff) << 16)
                        | ((hash[offset + 2] & 0xff) << 8)
                        | (hash[offset + 3] & 0xff);

        int otp = binary % MODULO;
        return String.format("%06d", otp);
    }

    public static String encodeBase32(byte[] data) {
        StringBuilder out = new StringBuilder((data.length * 8 + 4) / 5);
        int buffer = 0;
        int bitsLeft = 0;
        for (byte b : data) {
            buffer = (buffer << 8) | (b & 0xff);
            bitsLeft += 8;
            while (bitsLeft >= 5) {
                int index = (buffer >> (bitsLeft - 5)) & 0x1f;
                bitsLeft -= 5;
                out.append(BASE32_CHARS.charAt(index));
            }
        }
        if (bitsLeft > 0) {
            int index = (buffer << (5 - bitsLeft)) & 0x1f;
            out.append(BASE32_CHARS.charAt(index));
        }
        return out.toString();
    }

    public static byte[] decodeBase32(String base32) {
        String clean = base32.toUpperCase().replaceAll("[^A-Z2-7]", "");
        ByteArrayOutputStream out = new ByteArrayOutputStream((clean.length() * 5) / 8);
        int buffer = 0;
        int bitsLeft = 0;
        for (int i = 0; i < clean.length(); i++) {
            char c = clean.charAt(i);
            int val = c < BASE32_LOOKUP.length ? BASE32_LOOKUP[c] : -1;
            if (val == -1) continue;
            buffer = (buffer << 5) | val;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                out.write((buffer >> (bitsLeft - 8)) & 0xff);
                bitsLeft -= 8;
            }
        }
        return out.toByteArray();
    }
}
