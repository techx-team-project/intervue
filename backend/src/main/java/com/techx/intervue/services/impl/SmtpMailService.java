package com.techx.intervue.services.impl;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.util.HtmlUtils;

@Service
@Slf4j
@RequiredArgsConstructor
public class SmtpMailService implements MailServiceInterface {

    private static final String TEMPLATE_PATH = "templates/mail/%s.html";

    private final JavaMailSender mailSender;
    private final AppProperties appProperties;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Override
    public void sendHtml(
            String to, String subject, String template, Map<String, String> variables) {
        sendHtmlWithRaw(to, subject, template, variables, Map.of());
    }

    @Override
    public void sendHtmlWithRaw(
            String to,
            String subject,
            String template,
            Map<String, String> variables,
            Map<String, String> rawVariables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, false, StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress, appProperties.mailFromName());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(render(template, variables, rawVariables), true);
            mailSender.send(message);
        } catch (MessagingException | MailException | IOException e) {
            log.error("Failed to send '{}' email: {}", template, e.getMessage());
        }
    }

    private String render(
            String template, Map<String, String> variables, Map<String, String> rawVariables)
            throws IOException {
        String html =
                StreamUtils.copyToString(
                        new ClassPathResource(TEMPLATE_PATH.formatted(template)).getInputStream(),
                        StandardCharsets.UTF_8);
        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                html =
                        html.replace(
                                "{{" + entry.getKey() + "}}",
                                HtmlUtils.htmlEscape(entry.getValue()));
            }
        }
        if (rawVariables != null) {
            for (Map.Entry<String, String> entry : rawVariables.entrySet()) {
                html = html.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
        }
        return html;
    }
}
