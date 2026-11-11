package com.techx.intervue.modules.connect.events;

import com.techx.intervue.modules.connect.events.ConnectSseDispatchEvent.Recipient;
import com.techx.intervue.modules.connect.services.interfaces.ConnectSseServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ConnectSseEventListener {

    private final ConnectSseServiceInterface sseService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onDispatch(ConnectSseDispatchEvent event) {
        for (Recipient recipient : event.recipients()) {
            sseService.publishEvent(
                    recipient.actorType(), recipient.actorId(), event.eventName(), event.payload());
        }
    }
}
