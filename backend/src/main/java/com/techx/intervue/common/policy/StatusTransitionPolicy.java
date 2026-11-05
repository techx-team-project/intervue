package com.techx.intervue.common.policy;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

public abstract class StatusTransitionPolicy<S extends Enum<S>> {

    private final Map<S, Set<S>> allowed;

    protected StatusTransitionPolicy(Class<S> statusType, Map<S, Set<S>> transitions) {
        this.allowed = new EnumMap<>(statusType);
        this.allowed.putAll(transitions);
    }

    public boolean canTransition(S from, S to) {
        return allowed.getOrDefault(from, Set.of()).contains(to);
    }

    public Set<S> nextOf(S from) {
        return allowed.getOrDefault(from, Set.of());
    }

    public void requireTransition(S from, S to) {
        if (!canTransition(from, to)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
    }
}
