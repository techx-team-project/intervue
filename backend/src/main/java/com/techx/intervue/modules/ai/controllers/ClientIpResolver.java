package com.techx.intervue.modules.ai.controllers;

import jakarta.servlet.http.HttpServletRequest;

final class ClientIpResolver {

    private ClientIpResolver() {}

    static String resolve(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
