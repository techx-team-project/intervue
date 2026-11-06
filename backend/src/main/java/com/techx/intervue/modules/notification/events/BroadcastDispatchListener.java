package com.techx.intervue.modules.notification.events;

import com.techx.intervue.modules.notification.services.impl.BroadcastFanOutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

// Fan-out must start only after the SENDING status is committed, or the commit would
// overwrite the SENT status the fan-out writes.
@Component
@RequiredArgsConstructor
public class BroadcastDispatchListener {

    private final BroadcastFanOutService fanOutService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onDispatchRequested(BroadcastDispatchRequestedEvent event) {
        fanOutService.deliver(event.broadcastId(), event.audience(), event.recipientIds());
    }
}
