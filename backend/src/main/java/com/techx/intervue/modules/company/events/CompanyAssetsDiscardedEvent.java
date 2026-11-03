package com.techx.intervue.modules.company.events;

import java.util.List;

public record CompanyAssetsDiscardedEvent(List<String> publicIds) {}
