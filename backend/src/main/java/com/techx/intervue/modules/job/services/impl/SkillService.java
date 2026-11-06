package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.job.resources.SkillResource;
import com.techx.intervue.modules.job.services.interfaces.SkillServiceInterface;
import java.util.List;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SkillService implements SkillServiceInterface {

    private static final int MAX_SUGGESTIONS = 20;

    private final SkillCatalogCache catalogCache;

    @Override
    public List<SkillResource> suggest(String query) {
        List<SkillResource> active = catalogCache.activeSkills();
        if (query == null || query.isBlank()) {
            return active.stream().limit(MAX_SUGGESTIONS).toList();
        }
        String needle = query.trim().toLowerCase();
        List<SkillResource> prefixMatches =
                active.stream().filter(skill -> lower(skill).startsWith(needle)).toList();
        List<SkillResource> containedMatches =
                active.stream()
                        .filter(skill -> lower(skill).contains(needle))
                        .filter(skill -> !prefixMatches.contains(skill))
                        .toList();
        return Stream.concat(prefixMatches.stream(), containedMatches.stream())
                .limit(MAX_SUGGESTIONS)
                .toList();
    }

    private String lower(SkillResource skill) {
        return skill.name().toLowerCase();
    }
}
