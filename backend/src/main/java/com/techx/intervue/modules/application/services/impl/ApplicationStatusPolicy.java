package com.techx.intervue.modules.application.services.impl;

import static com.techx.intervue.modules.application.enums.ApplicationStatus.APPLIED;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.DRAFT;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.HIRED;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.INTERVIEW;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.IN_REVIEW;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.JOB_CLOSED;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.OFFER;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.REJECTED;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.VIEWED;
import static com.techx.intervue.modules.application.enums.ApplicationStatus.WITHDRAWN;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStatusPolicy {

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED =
            new EnumMap<>(ApplicationStatus.class);

    static {
        ALLOWED.put(DRAFT, EnumSet.of(APPLIED));
        ALLOWED.put(APPLIED, EnumSet.of(VIEWED, IN_REVIEW, REJECTED, WITHDRAWN, JOB_CLOSED));
        ALLOWED.put(VIEWED, EnumSet.of(IN_REVIEW, REJECTED, WITHDRAWN, JOB_CLOSED));
        ALLOWED.put(IN_REVIEW, EnumSet.of(INTERVIEW, REJECTED, WITHDRAWN, JOB_CLOSED));
        ALLOWED.put(INTERVIEW, EnumSet.of(OFFER, REJECTED, WITHDRAWN, JOB_CLOSED));
        ALLOWED.put(OFFER, EnumSet.of(HIRED, REJECTED, WITHDRAWN, JOB_CLOSED));
        ALLOWED.put(WITHDRAWN, EnumSet.of(APPLIED));
        ALLOWED.put(HIRED, EnumSet.noneOf(ApplicationStatus.class));
        ALLOWED.put(REJECTED, EnumSet.noneOf(ApplicationStatus.class));
        ALLOWED.put(JOB_CLOSED, EnumSet.noneOf(ApplicationStatus.class));
    }

    public boolean canTransition(ApplicationStatus from, ApplicationStatus to) {
        return ALLOWED.getOrDefault(from, Set.of()).contains(to);
    }

    public void requireTransition(ApplicationStatus from, ApplicationStatus to) {
        if (!canTransition(from, to)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
    }
}
