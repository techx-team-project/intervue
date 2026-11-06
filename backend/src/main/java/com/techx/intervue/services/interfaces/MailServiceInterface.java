package com.techx.intervue.services.interfaces;

import java.util.Map;

public interface MailServiceInterface {
    void sendHtml(String to, String subject, String template, Map<String, String> variables);

    default void sendHtmlWithRaw(
            String to,
            String subject,
            String template,
            Map<String, String> variables,
            Map<String, String> rawVariables) {
        sendHtml(to, subject, template, variables);
    }
}
