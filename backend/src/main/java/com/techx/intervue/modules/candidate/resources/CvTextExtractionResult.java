package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import lombok.Builder;

@Builder
public record CvTextExtractionResult(
        @JsonProperty("fileHash") String fileHash,
        @JsonProperty("readable") boolean readable,
        @JsonProperty("text") String text,
        @JsonProperty("unreadableReason") CvUnreadableReason unreadableReason,
        @JsonProperty("reasonMessage") String reasonMessage,
        @JsonProperty("pageCount") int pageCount,
        @JsonProperty("characterCount") int characterCount,
        @JsonProperty("fromCache") boolean fromCache) {

    public static CvTextExtractionResult readable(
            String fileHash, String text, int pageCount, boolean fromCache) {
        return CvTextExtractionResult.builder()
                .fileHash(fileHash)
                .readable(true)
                .text(text)
                .unreadableReason(null)
                .reasonMessage(null)
                .pageCount(pageCount)
                .characterCount(text != null ? text.length() : 0)
                .fromCache(fromCache)
                .build();
    }

    public static CvTextExtractionResult unreadable(
            String fileHash, CvUnreadableReason reason, int pageCount, boolean fromCache) {
        return CvTextExtractionResult.builder()
                .fileHash(fileHash)
                .readable(false)
                .text(null)
                .unreadableReason(reason)
                .reasonMessage(reason != null ? reason.getDefaultMessage() : null)
                .pageCount(pageCount)
                .characterCount(0)
                .fromCache(fromCache)
                .build();
    }

    public CvTextExtractionResult withFromCache(boolean cached) {
        return new CvTextExtractionResult(
                this.fileHash,
                this.readable,
                this.text,
                this.unreadableReason,
                this.reasonMessage,
                this.pageCount,
                this.characterCount,
                cached);
    }
}
