package com.techx.intervue.modules.user.services.interfaces;

import java.util.Optional;

public interface DeletionBlocker {

    Optional<String> checkBlocker(Long userId);
}
