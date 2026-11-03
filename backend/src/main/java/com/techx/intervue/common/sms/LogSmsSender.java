package com.techx.intervue.common.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Profile("local")
public class LogSmsSender implements SmsSenderInterface {

    @Override
    public void send(String phone, String message) {
        log.warn("[LOCAL SMS - not delivered] to={} content={}", phone, message);
    }
}
