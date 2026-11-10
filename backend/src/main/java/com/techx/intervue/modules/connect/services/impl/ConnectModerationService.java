package com.techx.intervue.modules.connect.services.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.connect.entities.ConnectMute;
import com.techx.intervue.modules.connect.entities.ConnectViolation;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import com.techx.intervue.modules.connect.repositories.ConnectFilterWordRepository;
import com.techx.intervue.modules.connect.repositories.ConnectMuteRepository;
import com.techx.intervue.modules.connect.repositories.ConnectViolationRepository;
import com.techx.intervue.modules.connect.resources.ConnectMuteStatusResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectModerationServiceInterface;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConnectModerationService implements ConnectModerationServiceInterface {

    private static final int MILD_STRIKE_THRESHOLD = 3;
    private static final Duration STRIKE_WINDOW = Duration.ofDays(30);
    private static final Duration FIRST_MUTE_DURATION = Duration.ofHours(24);
    private static final Duration REPEAT_MUTE_DURATION = Duration.ofDays(7);
    private static final Duration CACHE_TTL = Duration.ofHours(1);

    private final ConnectFilterWordRepository filterWordRepository;
    private final ConnectViolationRepository violationRepository;
    private final ConnectMuteRepository muteRepository;
    private final ReportServiceInterface reportService;
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    public record CachedFilterWord(String pattern, boolean regex, ConnectFilterSeverity severity) {}

    @Override
    public boolean isMuted(ConnectActorType actorType, Long actorId) {
        return muteRepository
                .findFirstByActorTypeAndActorIdAndLiftedAtIsNullAndExpiresAtAfterOrderByExpiresAtDesc(
                        actorType, actorId, Instant.now())
                .isPresent();
    }

    @Override
    public ConnectMuteStatusResource muteStatus(ConnectActorType actorType, Long actorId) {
        return muteRepository
                .findFirstByActorTypeAndActorIdAndLiftedAtIsNullAndExpiresAtAfterOrderByExpiresAtDesc(
                        actorType, actorId, Instant.now())
                .map(
                        mute ->
                                ConnectMuteStatusResource.builder()
                                        .muted(true)
                                        .expiresAt(mute.getExpiresAt())
                                        .reason(mute.getReason())
                                        .build())
                .orElseGet(() -> ConnectMuteStatusResource.builder().muted(false).build());
    }

    // Deliberately not @Transactional: the violation/mute/report writes below must survive the
    // MESSAGE_BLOCKED_BY_FILTER exception this throws, not roll back with it.
    @Override
    public void screen(ConnectActorType actorType, Long actorId, Long connectionId, String text) {
        if (text == null || text.isBlank()) {
            return;
        }
        String normalized = text.toLowerCase();
        for (CachedFilterWord word : getActiveFilterWords()) {
            boolean matched;
            if (word.regex()) {
                try {
                    Pattern pattern =
                            Pattern.compile(
                                    word.pattern(),
                                    Pattern.CASE_INSENSITIVE
                                            | Pattern.DOTALL
                                            | Pattern.UNICODE_CASE);
                    matched = pattern.matcher(text).find();
                } catch (PatternSyntaxException e) {
                    matched = normalized.contains(word.pattern().toLowerCase());
                }
            } else {
                matched = normalized.contains(word.pattern().toLowerCase());
            }
            if (matched) {
                recordViolation(actorType, actorId, connectionId, word.pattern(), word.severity());
                throw new AppException(ErrorCode.MESSAGE_BLOCKED_BY_FILTER);
            }
        }
    }

    private List<CachedFilterWord> getActiveFilterWords() {
        try {
            String json = redis.opsForValue().get(ConnectFilterWordService.ACTIVE_WORDS_CACHE_KEY);
            if (json != null && !json.isBlank()) {
                return objectMapper.readValue(json, new TypeReference<List<CachedFilterWord>>() {});
            }
        } catch (Exception e) {
            log.debug("Active filter words cache read failed: {}", e.getMessage());
        }

        List<CachedFilterWord> words =
                filterWordRepository.findByActiveTrue().stream()
                        .map(
                                w ->
                                        new CachedFilterWord(
                                                w.getPattern(), w.isRegex(), w.getSeverity()))
                        .toList();

        try {
            redis.opsForValue()
                    .set(
                            ConnectFilterWordService.ACTIVE_WORDS_CACHE_KEY,
                            objectMapper.writeValueAsString(words),
                            CACHE_TTL);
        } catch (Exception e) {
            log.debug("Active filter words cache write failed: {}", e.getMessage());
        }
        return words;
    }

    private void recordViolation(
            ConnectActorType actorType,
            Long actorId,
            Long connectionId,
            String pattern,
            ConnectFilterSeverity severity) {
        violationRepository.save(
                ConnectViolation.builder()
                        .actorType(actorType)
                        .actorId(actorId)
                        .connectionId(connectionId)
                        .matchedPattern(pattern)
                        .severity(severity)
                        .build());

        Instant windowStart = Instant.now().minus(STRIKE_WINDOW);
        long mildCount =
                violationRepository.countByActorTypeAndActorIdAndSeverityAndCreatedAtAfter(
                        actorType, actorId, ConnectFilterSeverity.MILD, windowStart);
        boolean crossesThreshold =
                severity == ConnectFilterSeverity.SEVERE || mildCount >= MILD_STRIKE_THRESHOLD;
        if (crossesThreshold) {
            applyMute(actorType, actorId, (int) mildCount);
        }
        if (severity == ConnectFilterSeverity.SEVERE) {
            reportService.file(
                    ReporterType.SYSTEM,
                    null,
                    ReportTargetType.CONVERSATION,
                    connectionId != null ? connectionId : 0L,
                    ReportReasonCode.INAPPROPRIATE,
                    "Tự động phát hiện qua bộ lọc nội dung Connect. Actor: "
                            + actorType
                            + "#"
                            + actorId
                            + ". Mẫu khớp: "
                            + pattern);
        }
    }

    private void applyMute(ConnectActorType actorType, Long actorId, int strikeCount) {
        Instant now = Instant.now();
        Instant windowStart = now.minus(STRIKE_WINDOW);
        Optional<ConnectMute> recent =
                muteRepository
                        .findFirstByActorTypeAndActorIdAndLiftedAtIsNullAndCreatedAtAfterOrderByCreatedAtDesc(
                                actorType, actorId, windowStart);
        if (recent.isPresent()) {
            ConnectMute mute = recent.get();
            Instant base = mute.getExpiresAt().isAfter(now) ? mute.getExpiresAt() : now;
            mute.setExpiresAt(base.plus(REPEAT_MUTE_DURATION));
            mute.setStrikeCountAtTime(strikeCount);
            muteRepository.save(mute);
        } else {
            muteRepository.save(
                    ConnectMute.builder()
                            .actorType(actorType)
                            .actorId(actorId)
                            .reason("InterVue Connect community guidelines violation")
                            .strikeCountAtTime(strikeCount)
                            .startsAt(now)
                            .expiresAt(now.plus(FIRST_MUTE_DURATION))
                            .build());
        }
    }
}
