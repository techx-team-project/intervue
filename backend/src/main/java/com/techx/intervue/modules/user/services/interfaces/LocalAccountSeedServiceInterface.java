package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.RoleType;
import java.util.Set;

public interface LocalAccountSeedServiceInterface {
    boolean createIfAbsent(String name, String email, String rawPassword, Set<RoleType> roles);
}
