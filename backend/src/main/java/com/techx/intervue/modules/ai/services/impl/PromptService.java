package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PromptService implements PromptServiceInterface {

    private static final Pattern NAME = Pattern.compile("[a-z0-9-]+");

    private final Map<String, PromptTemplate> cache = new ConcurrentHashMap<>();

    @Override
    public PromptTemplate load(String name, int version) {
        String id = name + ".v" + version;
        return cache.computeIfAbsent(id, key -> read(name, version, key));
    }

    private PromptTemplate read(String name, int version, String id) {
        if (!NAME.matcher(name).matches()) {
            log.error("Rejected AI prompt name {}", id);
            throw new AppException(ErrorCode.AI_PROMPT_NOT_FOUND);
        }
        try (InputStream input = new ClassPathResource("prompts/" + id + ".txt").getInputStream()) {
            String text = new String(input.readAllBytes(), StandardCharsets.UTF_8).strip();
            return new PromptTemplate(id, version, text);
        } catch (IOException ex) {
            log.error("Could not load AI prompt {}", id, ex);
            throw new AppException(ErrorCode.AI_PROMPT_NOT_FOUND);
        }
    }
}
