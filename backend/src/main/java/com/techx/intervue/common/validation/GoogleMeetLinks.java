package com.techx.intervue.common.validation;

import java.net.URI;
import java.net.URISyntaxException;

public final class GoogleMeetLinks {

    private static final String SCHEME = "https";
    private static final String HOST = "meet.google.com";

    private GoogleMeetLinks() {}

    public static boolean isValid(String link) {
        if (link == null || link.isBlank()) {
            return false;
        }
        try {
            URI uri = new URI(link.trim());
            String path = uri.getPath();
            return SCHEME.equalsIgnoreCase(uri.getScheme())
                    && HOST.equalsIgnoreCase(uri.getHost())
                    && uri.getUserInfo() == null
                    && uri.getPort() == -1
                    && path != null
                    && path.length() > 1;
        } catch (URISyntaxException invalid) {
            return false;
        }
    }
}
