package com.techx.intervue.common.device;

public final class DeviceLabelResolver {

    private DeviceLabelResolver() {}

    public static String resolve(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return "Unknown Device";
        }

        if (userAgent.contains("PostmanRuntime")) {
            return "Postman";
        }

        String browser = resolveBrowser(userAgent);
        String os = resolveOs(userAgent);

        if (browser != null && os != null) {
            return browser + " on " + os;
        }
        if (browser != null) {
            return browser;
        }
        if (os != null) {
            return os;
        }
        return "Unknown Device";
    }

    private static String resolveBrowser(String ua) {
        if (ua.contains("Edg/")) {
            return "Edge";
        }
        if (ua.contains("OPR/") || ua.contains("Opera")) {
            return "Opera";
        }
        if (ua.contains("Chrome/") && !ua.contains("Chromium")) {
            return "Chrome";
        }
        if (ua.contains("Firefox/")) {
            return "Firefox";
        }
        if (ua.contains("Safari/") && !ua.contains("Chrome/")) {
            return "Safari";
        }
        return null;
    }

    private static String resolveOs(String ua) {
        if (ua.contains("iPhone")) {
            return "iOS";
        }
        if (ua.contains("iPad")) {
            return "iPadOS";
        }
        if (ua.contains("Android")) {
            return "Android";
        }
        if (ua.contains("Macintosh") || ua.contains("Mac OS X")) {
            return "macOS";
        }
        if (ua.contains("Windows")) {
            return "Windows";
        }
        if (ua.contains("Linux")) {
            return "Linux";
        }
        return null;
    }
}
