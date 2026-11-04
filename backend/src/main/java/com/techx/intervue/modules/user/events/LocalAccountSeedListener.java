package com.techx.intervue.modules.user.events;

import com.techx.intervue.config.SeedProperties;
import com.techx.intervue.config.SeedProperties.SeedAccount;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.LocalAccountSeedServiceInterface;
import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class LocalAccountSeedListener {

    private static final Set<String> KNOWN_ROLES =
            Arrays.stream(RoleType.values())
                    .map(Enum::name)
                    .collect(Collectors.toUnmodifiableSet());

    private final SeedProperties seedProperties;
    private final LocalAccountSeedServiceInterface localAccountSeedService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        seedProperties.accounts().forEach(this::seed);
    }

    private void seed(String key, SeedAccount account) {
        if (!StringUtils.hasText(account.password())) {
            log.warn("Skipping seed account '{}': password is not configured", key);
            return;
        }
        if (!StringUtils.hasText(account.email())
                || !StringUtils.hasText(account.name())
                || account.roles() == null
                || account.roles().isEmpty()
                || !account.roles().stream().allMatch(StringUtils::hasText)) {
            log.warn("Skipping seed account '{}': email, name and roles are required", key);
            return;
        }
        Set<String> unknownRoles =
                account.roles().stream()
                        .filter(name -> !KNOWN_ROLES.contains(normalizeRole(name)))
                        .collect(Collectors.toUnmodifiableSet());
        if (!unknownRoles.isEmpty()) {
            log.warn("Skipping seed account '{}': unknown roles {}", key, unknownRoles);
            return;
        }

        Set<RoleType> roles =
                account.roles().stream()
                        .map(name -> RoleType.valueOf(normalizeRole(name)))
                        .collect(Collectors.toUnmodifiableSet());
        boolean created =
                localAccountSeedService.createIfAbsent(
                        account.name(), account.email(), account.password(), roles);
        if (created) {
            log.info("Seeded local account '{}' with roles {}", key, roles);
        } else {
            log.info("Seed account '{}' already exists", key);
        }
    }

    private static String normalizeRole(String name) {
        return name.trim().toUpperCase(Locale.ROOT);
    }
}
