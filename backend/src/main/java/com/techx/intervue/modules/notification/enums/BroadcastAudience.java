package com.techx.intervue.modules.notification.enums;

public enum BroadcastAudience {
    CANDIDATE(RecipientType.USER),
    RECRUITER(RecipientType.RECRUITER),
    ADMIN(RecipientType.USER);

    private final RecipientType recipientType;

    BroadcastAudience(RecipientType recipientType) {
        this.recipientType = recipientType;
    }

    public RecipientType recipientType() {
        return recipientType;
    }
}
