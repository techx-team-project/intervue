package com.techx.intervue.modules.ai.services.interfaces;

import java.util.Optional;

public interface SmallTalkServiceInterface {

    Optional<String> reply(String message);
}
