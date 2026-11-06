package com.techx.intervue.modules.user.events;

import com.techx.intervue.modules.user.enums.AccountType;
import java.time.Instant;
import lombok.Builder;

@Builder
public record NewDeviceSignInEvent(
        AccountType accountType,
        Long accountId,
        String deviceLabel,
        String location,
        String ip,
        Instant at) {}
