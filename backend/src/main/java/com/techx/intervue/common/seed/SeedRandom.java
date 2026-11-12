package com.techx.intervue.common.seed;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;

public final class SeedRandom {

    private static final long SECONDS_PER_DAY = 86_400;

    private final Random random;
    private final LocalDateTime now;

    public SeedRandom(long seed) {
        this.random = new Random(seed);
        this.now = LocalDateTime.now(ZoneOffset.UTC).withNano(0);
    }

    public LocalDateTime now() {
        return now;
    }

    public int between(int min, int max) {
        return min + random.nextInt(max - min + 1);
    }

    public double between(double min, double max) {
        return min + random.nextDouble() * (max - min);
    }

    public boolean chance(double probability) {
        return random.nextDouble() < probability;
    }

    public <T> T pick(List<T> items) {
        return items.get(random.nextInt(items.size()));
    }

    public <T> List<T> sample(List<T> items, int count) {
        List<T> shuffled = new ArrayList<>(items);
        Collections.shuffle(shuffled, random);
        return shuffled.subList(0, Math.min(count, shuffled.size()));
    }

    public <T> T pickWeighted(Map<T, Integer> weights) {
        int total = weights.values().stream().mapToInt(Integer::intValue).sum();
        int roll = random.nextInt(total);
        for (Map.Entry<T, Integer> entry : weights.entrySet()) {
            roll -= entry.getValue();
            if (roll < 0) {
                return entry.getKey();
            }
        }
        throw new IllegalStateException("Weights must not be empty");
    }

    public LocalDateTime ago(double minDays, double maxDays) {
        return now.minusSeconds((long) (between(minDays, maxDays) * SECONDS_PER_DAY));
    }

    public LocalDateTime ahead(double minDays, double maxDays) {
        return now.plusSeconds((long) (between(minDays, maxDays) * SECONDS_PER_DAY));
    }
}
