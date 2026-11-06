package com.techx.intervue.modules.notification.templates;

import com.techx.intervue.modules.notification.enums.NotificationType;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.EnumMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

@Component
public class NotificationTemplateRegistry {

    private static final String RESOURCE_PATH = "notifications/templates.yaml";
    private static final Pattern PLACEHOLDER = Pattern.compile("\\{([a-zA-Z0-9_]+)}");
    private static final String MISSING_VALUE = "—";

    private final Map<NotificationType, NotificationTemplate> templates =
            new EnumMap<>(NotificationType.class);

    @PostConstruct
    @SuppressWarnings("unchecked")
    void load() {
        Map<String, Object> root;
        try (InputStream stream = new ClassPathResource(RESOURCE_PATH).getInputStream()) {
            root = new Yaml().load(stream);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read " + RESOURCE_PATH, e);
        }

        Map<String, Map<String, String>> entries =
                (Map<String, Map<String, String>>) root.get("templates");
        entries.forEach(
                (key, value) ->
                        templates.put(
                                NotificationType.valueOf(key),
                                new NotificationTemplate(
                                        value.get("title"),
                                        value.get("summary"),
                                        value.get("body"),
                                        value.get("actionLabel"),
                                        value.get("actionUrl"))));

        for (NotificationType type : NotificationType.values()) {
            if (type != NotificationType.ANNOUNCEMENT && !templates.containsKey(type)) {
                throw new IllegalStateException(
                        "Missing notification template for " + type + " in " + RESOURCE_PATH);
            }
        }
    }

    public NotificationTemplate render(NotificationType type, Map<String, Object> params) {
        NotificationTemplate template = templates.get(type);
        if (template == null) {
            throw new IllegalStateException("No notification template registered for " + type);
        }
        return new NotificationTemplate(
                fill(template.title(), params),
                fill(template.summary(), params),
                fill(template.body(), params),
                template.actionLabel(),
                template.actionUrl());
    }

    private String fill(String text, Map<String, Object> params) {
        if (text == null || text.isBlank()) {
            return text;
        }
        Matcher matcher = PLACEHOLDER.matcher(text);
        StringBuilder result = new StringBuilder();
        while (matcher.find()) {
            Object value = params == null ? null : params.get(matcher.group(1));
            String replacement = value == null ? MISSING_VALUE : value.toString();
            matcher.appendReplacement(result, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(result);
        return result.toString();
    }
}
