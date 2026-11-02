package com.techx.intervue.modules.user.enums;

import com.techx.intervue.common.audit.enums.AuditAction;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RestrictionKind {
    BAN(UserStatus.BANNED, AuditAction.USER_BANNED, AuditAction.USER_UNBANNED);

    private final UserStatus status;
    private final AuditAction appliedAction;
    private final AuditAction liftedAction;
}
