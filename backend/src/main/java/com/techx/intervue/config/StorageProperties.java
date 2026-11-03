package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "storage")
public record StorageProperties(
        String cloudinaryUrl,
        String rootFolder,
        DataSize maxDocumentSize,
        DataSize maxImageSize,
        Duration fetchTimeout) {}
