package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedData.OwnerAccount;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.IdSequence;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedRandom;
import com.techx.intervue.common.seed.SeedText;
import com.techx.intervue.modules.user.enums.RoleType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@Order(1)
@RequiredArgsConstructor
public class AccountSeedStep implements DemoSeedStep {

    private static final List<String> USER_COLUMNS =
            List.of(
                    "id",
                    "name",
                    "email",
                    "password",
                    "status",
                    "token_version",
                    "email_verified_at",
                    "terms_accepted_at",
                    "created_at",
                    "updated_at");

    private static final String INSERT_USER_ROLE =
            "INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?";

    private final SeedDatabase database;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void seed() {
        List<String> candidateNames =
                DemoSeedData.fakeNames(
                        new SeedRandom(DemoSeedData.RANDOM_SEED),
                        DemoSeedData.FAKE_CANDIDATES,
                        DemoSeedData.OWNERS.stream()
                                .map(OwnerAccount::name)
                                .collect(Collectors.toSet()));
        SeedRandom times = new SeedRandom(DemoSeedData.RANDOM_SEED + 1);
        Set<String> knownEmails =
                new HashSet<>(
                        database.jdbc().queryForList("SELECT email FROM users", String.class));
        IdSequence ids = database.sequence("users");
        String passwordHash = passwordEncoder.encode(DemoSeedData.PASSWORD);

        List<Object[]> users = new ArrayList<>();
        List<Object[]> roles = new ArrayList<>();
        for (OwnerAccount owner : DemoSeedData.OWNERS) {
            if (knownEmails.add(owner.email())) {
                long id = ids.next();
                users.add(
                        userRow(id, owner.name(), owner.email(), passwordHash, times.ago(60, 90)));
                roles.add(new Object[] {id, RoleType.ADMIN.name()});
                roles.add(new Object[] {id, RoleType.CANDIDATE.name()});
            }
        }
        for (int index = 0; index < candidateNames.size(); index++) {
            String name = candidateNames.get(index);
            String email =
                    "demo."
                            + SeedText.slug(name)
                            + "."
                            + (index + 1)
                            + "@"
                            + DemoSeedData.FAKE_EMAIL_DOMAIN;
            LocalDateTime createdAt = times.ago(1, 80);
            if (knownEmails.add(email)) {
                long id = ids.next();
                users.add(userRow(id, name, email, passwordHash, createdAt));
                roles.add(new Object[] {id, RoleType.CANDIDATE.name()});
            }
        }

        database.insert("users", USER_COLUMNS, users);
        database.batch(INSERT_USER_ROLE, roles);
        log.info("Seeded {} users", users.size());
    }

    private Object[] userRow(
            long id, String name, String email, String passwordHash, LocalDateTime createdAt) {
        return new Object[] {
            id, name, email, passwordHash, "ACTIVE", 1, createdAt, createdAt, createdAt, createdAt
        };
    }
}
