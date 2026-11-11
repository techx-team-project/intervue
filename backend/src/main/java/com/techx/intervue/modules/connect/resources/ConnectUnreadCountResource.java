package com.techx.intervue.modules.connect.resources;

public record ConnectUnreadCountResource(long total, long unreadMessages, long pendingInvitations) {

    public ConnectUnreadCountResource(long total) {
        this(total, total, 0);
    }
}
