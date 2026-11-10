package com.techx.intervue.modules.ads.resources;

import java.time.LocalDate;

public record AdWeekResource(
        LocalDate weekStart, LocalDate weekEnd, boolean available, boolean mine) {}
