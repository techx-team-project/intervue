package com.techx.intervue.services.interfaces;

import java.util.Map;

public interface MailServiceInterface {
    void sendHtml(String to, String subject, String template, Map<String, String> variables);
}
