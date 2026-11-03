package com.techx.intervue.modules.company.events;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
public class PublishRightLossListener {

    // Records the derived consequence rather than the action that caused it: the audit log already
    // holds the revocation, this line is what the job module will react to once it exists.
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onPublishRightLost(PublishRightLostEvent event) {
        log.info(
                "Publish right lost: scope={} cause={} company={} user={} reassignTo={}",
                event.scope(),
                event.cause(),
                event.companyId(),
                event.userId(),
                event.reassignToUserId());
    }
}
