package com.techx.intervue.modules.job.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.job.mappers.SkillMapper;
import com.techx.intervue.modules.job.repositories.SkillRepository;
import com.techx.intervue.modules.job.resources.SkillResource;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SkillCatalogCache {

    private static final String KEY = "cache:skills:active";
    private static final Duration TTL = Duration.ofMinutes(10);

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;
    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    public List<SkillResource> activeSkills() {
        String cached = redis.opsForValue().get(KEY);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<SkillResource>>() {});
            } catch (JsonProcessingException e) {
                log.warn("Discarding unreadable skill catalog cache: {}", e.getMessage());
            }
        }
        List<SkillResource> loaded =
                skillRepository.findByActiveTrueOrderByNameAsc().stream()
                        .map(skillMapper::toResource)
                        .toList();
        store(loaded);
        return loaded;
    }

    public void evict() {
        redis.delete(KEY);
    }

    private void store(List<SkillResource> skills) {
        try {
            redis.opsForValue().set(KEY, objectMapper.writeValueAsString(skills), TTL);
        } catch (JsonProcessingException e) {
            log.warn("Could not cache the skill catalog: {}", e.getMessage());
        }
    }
}
