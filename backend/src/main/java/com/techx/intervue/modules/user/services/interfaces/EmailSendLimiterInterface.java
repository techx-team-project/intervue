package com.techx.intervue.modules.user.services.interfaces;

public interface EmailSendLimiterInterface {
    void check(String route, String email, String ip);
}
