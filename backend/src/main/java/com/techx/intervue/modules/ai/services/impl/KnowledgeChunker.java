package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.KnowledgeChunk;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KnowledgeChunker {

    private static final Pattern DOC_TITLE = Pattern.compile("^#\\s+(.+)$", Pattern.MULTILINE);
    private static final Pattern SECTION_SPLIT = Pattern.compile("(?m)^(?=##\\s+)");
    private static final Pattern SUBSECTION_SPLIT = Pattern.compile("(?m)^(?=###\\s+)");
    private static final int MAX_CHUNK_TOKENS = 500;

    public List<KnowledgeChunk> loadAndChunkAll() {
        List<KnowledgeChunk> allChunks = new ArrayList<>();
        try {
            PathMatchingResourcePatternResolver resolver =
                    new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:knowledge/*.md");
            for (Resource resource : resources) {
                String filename = resource.getFilename();
                String text = resource.getContentAsString(StandardCharsets.UTF_8);
                allChunks.addAll(chunkDocument(filename, text));
            }
        } catch (IOException ex) {
            log.error("Failed to load knowledge documents from classpath", ex);
        }
        return allChunks;
    }

    public List<KnowledgeChunk> chunkDocument(String documentName, String markdown) {
        List<KnowledgeChunk> chunks = new ArrayList<>();
        if (markdown == null || markdown.isBlank()) {
            return chunks;
        }

        String docTitle = extractDocTitle(markdown, documentName);
        String[] sections = SECTION_SPLIT.split(markdown);

        for (String section : sections) {
            String trimmed = section.trim();
            if (trimmed.isEmpty() || trimmed.startsWith("# ") && !trimmed.contains("## ")) {
                continue;
            }

            int estimatedTokens = estimateTokens(trimmed);
            if (estimatedTokens > MAX_CHUNK_TOKENS && trimmed.contains("### ")) {
                chunks.addAll(splitSubsections(documentName, docTitle, trimmed));
            } else {
                String heading = extractHeading(trimmed, "## ");
                String content = buildChunkText(docTitle, heading, trimmed);
                chunks.add(
                        new KnowledgeChunk(
                                documentName, heading, content, estimateTokens(content)));
            }
        }

        return chunks;
    }

    private List<KnowledgeChunk> splitSubsections(
            String documentName, String docTitle, String sectionText) {
        List<KnowledgeChunk> chunks = new ArrayList<>();
        String sectionHeading = extractHeading(sectionText, "## ");
        String[] subsections = SUBSECTION_SPLIT.split(sectionText);

        for (String subsection : subsections) {
            String trimmed = subsection.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            String heading =
                    trimmed.startsWith("### ")
                            ? sectionHeading + " - " + extractHeading(trimmed, "### ")
                            : sectionHeading;
            String content = buildChunkText(docTitle, heading, trimmed);
            chunks.add(new KnowledgeChunk(documentName, heading, content, estimateTokens(content)));
        }
        return chunks;
    }

    private String buildChunkText(String docTitle, String heading, String body) {
        StringBuilder builder = new StringBuilder();
        if (docTitle != null && !docTitle.isBlank()) {
            builder.append("# ").append(docTitle).append("\n\n");
        }
        if (!body.startsWith("## ") && !body.startsWith("### ")) {
            builder.append("## ").append(heading).append("\n\n");
        }
        builder.append(body);
        return builder.toString().trim();
    }

    private String extractDocTitle(String markdown, String fallback) {
        Matcher matcher = DOC_TITLE.matcher(markdown);
        return matcher.find() ? matcher.group(1).trim() : fallback;
    }

    private String extractHeading(String text, String prefix) {
        for (String line : text.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.startsWith(prefix)) {
                return trimmed.substring(prefix.length()).trim();
            }
        }
        return "General";
    }

    public static int estimateTokens(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        int words = text.trim().split("\\s+").length;
        return (int) Math.round(words * 1.3);
    }
}
