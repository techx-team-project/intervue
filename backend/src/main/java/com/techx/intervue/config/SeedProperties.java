package com.techx.intervue.config;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "seed")
public record SeedProperties(Map<String, SeedAccount> accounts) {

    public SeedProperties {
        accounts =
                accounts == null
                        ? Map.of()
                        : Collections.unmodifiableMap(new LinkedHashMap<>(accounts));
    }

    public record SeedAccount(String email, String name, String password, Set<String> roles) {

        @Override
        public String toString() {
            return "SeedAccount[email=%s, name=%s, roles=%s]".formatted(email, name, roles);
        }
    }
}
