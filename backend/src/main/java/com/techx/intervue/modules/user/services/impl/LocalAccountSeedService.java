package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.Role;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.repositories.RoleRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.services.interfaces.LocalAccountSeedServiceInterface;
import java.time.Instant;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("local")
@RequiredArgsConstructor
public class LocalAccountSeedService implements LocalAccountSeedServiceInterface {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public boolean createIfAbsent(
            String name, String email, String rawPassword, Set<RoleType> roles) {
        String normalizedEmail = EmailHelper.normalize(email);
        if (userRepository.existsByEmail(normalizedEmail)) {
            return false;
        }

        Instant now = Instant.now();
        User user =
                User.builder()
                        .name(name.trim())
                        .email(normalizedEmail)
                        .password(passwordEncoder.encode(rawPassword))
                        .emailVerifiedAt(now)
                        .termsAcceptedAt(now)
                        .build();
        roles.forEach(roleType -> user.addRole(findRole(roleType)));
        userRepository.save(user);
        return true;
    }

    private Role findRole(RoleType roleType) {
        return roleRepository
                .findByName(roleType)
                .orElseThrow(() -> new IllegalStateException(roleType + " role is missing"));
    }
}
