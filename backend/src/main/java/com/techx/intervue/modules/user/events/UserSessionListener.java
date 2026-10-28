package com.techx.intervue.modules.user.events;

import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class UserSessionListener {

    private final AuthSessionServiceInterface authSessionService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onUserRolesChanged(UserRolesChangedEvent event) {
        authSessionService.invalidate(event.userId());
    }
}
