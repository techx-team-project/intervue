package com.techx.intervue.modules.candidate.services.impl;

import java.text.CollationKey;
import java.text.Collator;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CandidateTextNormalizer {

    public List<String> normalizeValues(Collection<String> values) {
        List<String> kept = new ArrayList<>();
        if (values == null) {
            return kept;
        }
        Collator collator = newCollator();
        Set<CollationKey> seen = new TreeSet<>();
        for (String value : values) {
            if (value == null) {
                continue;
            }
            String trimmed = value.trim();
            if (StringUtils.hasText(trimmed)
                    && seen.add(collator.getCollationKey(foldKey(trimmed)))) {
                kept.add(trimmed);
            }
        }
        return kept;
    }

    public boolean sameText(String first, String second) {
        return newCollator().compare(foldKey(first.trim()), foldKey(second.trim())) == 0;
    }

    private Collator newCollator() {
        Collator collator = Collator.getInstance(Locale.ROOT);
        collator.setStrength(Collator.PRIMARY);
        return collator;
    }

    private String foldKey(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFKD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT);
    }
}
