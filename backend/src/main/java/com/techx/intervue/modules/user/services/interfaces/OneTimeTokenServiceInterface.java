package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import java.util.Optional;

public interface OneTimeTokenServiceInterface {
    String issue(OneTimeTokenPurpose purpose, Long userId);

    Optional<Long> peek(OneTimeTokenPurpose purpose, String rawToken);

    Optional<Long> consume(OneTimeTokenPurpose purpose, String rawToken);
}
