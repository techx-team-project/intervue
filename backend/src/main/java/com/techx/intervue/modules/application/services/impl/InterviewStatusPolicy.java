package com.techx.intervue.modules.application.services.impl;

import static com.techx.intervue.modules.application.enums.InterviewStatus.CANCELLED;
import static com.techx.intervue.modules.application.enums.InterviewStatus.CONFIRMED;
import static com.techx.intervue.modules.application.enums.InterviewStatus.DECLINED;
import static com.techx.intervue.modules.application.enums.InterviewStatus.PROPOSED;
import static com.techx.intervue.modules.application.enums.InterviewStatus.RESCHEDULE_REQUESTED;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class InterviewStatusPolicy {

    private static final Map<InterviewStatus, Set<InterviewStatus>> ALLOWED =
            new EnumMap<>(InterviewStatus.class);

    static {
        ALLOWED.put(
                PROPOSED,
                EnumSet.of(PROPOSED, CONFIRMED, DECLINED, RESCHEDULE_REQUESTED, CANCELLED));
        ALLOWED.put(CONFIRMED, EnumSet.of(PROPOSED, DECLINED, RESCHEDULE_REQUESTED, CANCELLED));
        ALLOWED.put(RESCHEDULE_REQUESTED, EnumSet.of(PROPOSED, CONFIRMED, DECLINED, CANCELLED));
        ALLOWED.put(DECLINED, EnumSet.noneOf(InterviewStatus.class));
        ALLOWED.put(CANCELLED, EnumSet.noneOf(InterviewStatus.class));
    }

    public void requireTransition(InterviewStatus from, InterviewStatus to) {
        if (!ALLOWED.getOrDefault(from, Set.of()).contains(to)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
    }
}
