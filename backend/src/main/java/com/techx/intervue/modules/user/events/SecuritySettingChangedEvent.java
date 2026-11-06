package com.techx.intervue.modules.user.events;

import com.techx.intervue.modules.user.enums.AccountType;

public record SecuritySettingChangedEvent(AccountType accountType, Long accountId, String change) {}
