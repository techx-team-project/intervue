package com.techx.intervue.modules.application.enums;

import java.util.EnumSet;
import java.util.Set;

public enum InterviewStatus {
    PROPOSED,
    CONFIRMED,
    DECLINED,
    RESCHEDULE_REQUESTED,
    CANCELLED;

    public static final Set<InterviewStatus> ACTIVE =
            EnumSet.of(PROPOSED, CONFIRMED, RESCHEDULE_REQUESTED);
}
