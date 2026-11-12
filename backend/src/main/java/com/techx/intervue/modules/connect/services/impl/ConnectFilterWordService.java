package com.techx.intervue.modules.connect.services.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import com.techx.intervue.modules.connect.enums.FilterScope;
import com.techx.intervue.modules.connect.mappers.ConnectMapper;
import com.techx.intervue.modules.connect.repositories.ConnectFilterWordRepository;
import com.techx.intervue.modules.connect.requests.CreateFilterWordRequest;
import com.techx.intervue.modules.connect.requests.UpdateFilterWordRequest;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectFilterWordServiceInterface;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ConnectFilterWordService implements ConnectFilterWordServiceInterface {

    private static final String ACTIVE_WORDS_CACHE_PREFIX = "connect:filter-words:active:";
    private static final Duration CACHE_TTL = Duration.ofHours(1);

    private final ConnectFilterWordRepository filterWordRepository;
    private final ConnectMapper connectMapper;
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ConnectFilterWordResource> list(FilterScope scope, Pageable pageable) {
        return filterWordRepository
                .findByScope(scope, pageable)
                .map(connectMapper::toFilterWordResource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActiveFilterWord> activeWords(FilterScope scope) {
        String cacheKey = ACTIVE_WORDS_CACHE_PREFIX + scope;
        try {
            String json = redis.opsForValue().get(cacheKey);
            if (json != null && !json.isBlank()) {
                return objectMapper.readValue(json, new TypeReference<List<ActiveFilterWord>>() {});
            }
        } catch (Exception e) {
            log.debug("Active filter words cache read failed: {}", e.getMessage());
        }

        List<ActiveFilterWord> words =
                filterWordRepository.findByActiveTrueAndScope(scope).stream()
                        .map(
                                word ->
                                        new ActiveFilterWord(
                                                word.getPattern(),
                                                word.isRegex(),
                                                word.getSeverity()))
                        .toList();

        try {
            redis.opsForValue().set(cacheKey, objectMapper.writeValueAsString(words), CACHE_TTL);
        } catch (Exception e) {
            log.debug("Active filter words cache write failed: {}", e.getMessage());
        }
        return words;
    }

    @Override
    public ConnectFilterWordResource create(CreateFilterWordRequest request) {
        validatePattern(request.pattern(), request.regex());

        ConnectFilterWord entity =
                ConnectFilterWord.builder()
                        .pattern(request.pattern().trim())
                        .scope(request.scope() == null ? FilterScope.CONNECT : request.scope())
                        .regex(request.regex())
                        .severity(request.severity())
                        .active(request.active())
                        .note(request.note() != null ? request.note().trim() : null)
                        .build();

        ConnectFilterWord saved = filterWordRepository.save(entity);
        evictCache();
        return connectMapper.toFilterWordResource(saved);
    }

    @Override
    public ConnectFilterWordResource update(Long id, UpdateFilterWordRequest request) {
        validatePattern(request.pattern(), request.regex());

        ConnectFilterWord entity =
                filterWordRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        entity.setPattern(request.pattern().trim());
        entity.setRegex(request.regex());
        entity.setSeverity(request.severity());
        entity.setActive(request.active());
        entity.setNote(request.note() != null ? request.note().trim() : null);

        ConnectFilterWord saved = filterWordRepository.save(entity);
        evictCache();
        return connectMapper.toFilterWordResource(saved);
    }

    @Override
    public void delete(Long id) {
        ConnectFilterWord entity =
                filterWordRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        filterWordRepository.delete(entity);
        evictCache();
    }

    @Override
    public ConnectFilterWordResource toggleActive(Long id) {
        ConnectFilterWord entity =
                filterWordRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        entity.setActive(!entity.isActive());
        ConnectFilterWord saved = filterWordRepository.save(entity);
        evictCache();
        return connectMapper.toFilterWordResource(saved);
    }

    private void evictCache() {
        try {
            redis.delete(
                    Arrays.stream(FilterScope.values())
                            .map(scope -> ACTIVE_WORDS_CACHE_PREFIX + scope)
                            .toList());
        } catch (Exception e) {
            log.debug("Failed to evict active filter words cache: {}", e.getMessage());
        }
    }

    private void validatePattern(String pattern, boolean regex) {
        if (regex) {
            try {
                Pattern.compile(pattern);
            } catch (PatternSyntaxException exception) {
                throw new AppException(ErrorCode.VALIDATION_FAILED);
            }
        }
    }
}
