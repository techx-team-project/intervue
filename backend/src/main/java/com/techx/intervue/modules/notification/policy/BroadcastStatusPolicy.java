package com.techx.intervue.modules.notification.policy;

import com.techx.intervue.common.policy.StatusTransitionPolicy;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class BroadcastStatusPolicy extends StatusTransitionPolicy<BroadcastStatus> {

    public BroadcastStatusPolicy() {
        super(
                BroadcastStatus.class,
                Map.of(
                        BroadcastStatus.DRAFT,
                                Set.of(
                                        BroadcastStatus.SCHEDULED,
                                        BroadcastStatus.SENDING,
                                        BroadcastStatus.CANCELLED),
                        BroadcastStatus.SCHEDULED,
                                Set.of(BroadcastStatus.SENDING, BroadcastStatus.CANCELLED),
                        BroadcastStatus.SENDING, Set.of(BroadcastStatus.SENT),
                        BroadcastStatus.SENT, Set.of(),
                        BroadcastStatus.CANCELLED, Set.of()));
    }

    public boolean isEditable(BroadcastStatus status) {
        return status == BroadcastStatus.DRAFT || status == BroadcastStatus.SCHEDULED;
    }
}
