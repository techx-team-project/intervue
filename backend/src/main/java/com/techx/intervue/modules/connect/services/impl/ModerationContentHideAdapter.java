package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.connect.entities.Connection;
import com.techx.intervue.modules.connect.repositories.ConnectionRepository;
import com.techx.intervue.modules.moderation.services.interfaces.ConversationContentPortInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ModerationContentHideAdapter implements ConversationContentPortInterface {

    private final ConnectionRepository connectionRepository;

    @Override
    @Transactional
    public void hideContent(Long connectionId) {
        Connection connection =
                connectionRepository
                        .findById(connectionId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (connection.getContentHiddenAt() == null) {
            connection.setContentHiddenAt(Instant.now());
        }
    }
}
