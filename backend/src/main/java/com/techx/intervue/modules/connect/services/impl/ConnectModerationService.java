package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import com.techx.intervue.modules.connect.entities.ConnectMute;
import com.techx.intervue.modules.connect.entities.ConnectViolation;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import com.techx.intervue.modules.connect.repositories.ConnectFilterWordRepository;
import com.techx.intervue.modules.connect.repositories.ConnectMuteRepository;
import com.techx.intervue.modules.connect.repositories.ConnectViolationRepository;
import com.techx.intervue.modules.connect.services.interfaces.ConnectModerationServiceInterface;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectModerationService implements ConnectModerationServiceInterface {

    private static final int MILD_STRIKE_THRESHOLD = 3;
    private static final Duration STRIKE_WINDOW = Duration.ofDays(30);
    private static final Duration FIRST_MUTE_DURATION = Duration.ofHours(24);
    private static final Duration REPEAT_MUTE_DURATION = Duration.ofDays(7);

    private final ConnectFilterWordRepository filterWordRepository;
    private final ConnectViolationRepository violationRepository;
    private final ConnectMuteRepository muteRepository;
    private final ReportServiceInterface reportService;

    @Override
    public boolean isMuted(ConnectActorType actorType, Long actorId) {
        return muteRepository
                .findFirstByActorTypeAndActorIdAndLiftedAtIsNullAndExpiresAtAfterOrderByExpiresAtDesc(
                        actorType, actorId, Instant.now())
                .isPresent();
    }

    // Deliberately not @Transactional: the violation/mute/report writes below must survive the
    // MESSAGE_BLOCKED_BY_FILTER exception this throws, not roll back with it.
    @Override
    public void screen(ConnectActorType actorType, Long actorId, Long connectionId, String text) {
        if (text == null || text.isBlank()) {
            return;
        }
        String normalized = text.toLowerCase();
        for (ConnectFilterWord word : filterWordRepository.findByActiveTrue()) {
            boolean matched;
            if (word.isRegex()) {
                try {
                    Pattern pattern =
                            Pattern.compile(
                                    word.getPattern(),
                                    Pattern.CASE_INSENSITIVE
                                            | Pattern.DOTALL
                                            | Pattern.UNICODE_CASE);
                    matched = pattern.matcher(text).find();
                } catch (PatternSyntaxException e) {
                    matched = normalized.contains(word.getPattern().toLowerCase());
                }
            } else {
                matched = normalized.contains(word.getPattern().toLowerCase());
            }
            if (matched) {
                recordViolation(actorType, actorId, connectionId, word);
                throw new AppException(ErrorCode.MESSAGE_BLOCKED_BY_FILTER);
            }
        }
    }

    private void recordViolation(
            ConnectActorType actorType, Long actorId, Long connectionId, ConnectFilterWord word) {
        violationRepository.save(
                ConnectViolation.builder()
                        .actorType(actorType)
                        .actorId(actorId)
                        .connectionId(connectionId)
                        .matchedPattern(word.getPattern())
                        .severity(word.getSeverity())
                        .build());

        Instant windowStart = Instant.now().minus(STRIKE_WINDOW);
        long mildCount =
                violationRepository.countByActorTypeAndActorIdAndSeverityAndCreatedAtAfter(
                        actorType, actorId, ConnectFilterSeverity.MILD, windowStart);
        boolean crossesThreshold =
                word.getSeverity() == ConnectFilterSeverity.SEVERE
                        || mildCount >= MILD_STRIKE_THRESHOLD;
        if (crossesThreshold) {
            applyMute(actorType, actorId, (int) mildCount);
        }
        if (word.getSeverity() == ConnectFilterSeverity.SEVERE) {
            reportService.file(
                    ReporterType.SYSTEM,
                    null,
                    ReportTargetType.CONVERSATION,
                    connectionId,
                    ReportReasonCode.INAPPROPRIATE,
                    "Tự động phát hiện qua bộ lọc nội dung Connect. Actor: "
                            + actorType
                            + "#"
                            + actorId
                            + ". Mẫu khớp: "
                            + word.getPattern());
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
                            .reason("Vi phạm quy tắc cộng đồng Connect")
                            .strikeCountAtTime(strikeCount)
                            .startsAt(now)
                            .expiresAt(now.plus(FIRST_MUTE_DURATION))
                            .build());
        }
    }
}
